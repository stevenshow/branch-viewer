import { Octokit } from '@octokit/core';

export default async function handler(req, res) {
  const { repoOwner, team } = req.query;
  const accessToken = process.env.API_KEY;

  const categorizeBranch = (branch) => {
    if (/^(test|staging|stage|production|prod)$/.test(branch.name)) {
      return branch.name;
    }
    return null;
  };

  const octokit = new Octokit({
    auth: accessToken,
  });

  try {
    const repos = await octokit.request(
      `GET /orgs/{owner}/teams/${team}/repos`,
      {
        owner: repoOwner,
      },
    );

    const comparisonBranchesPromises = repos.data.map(async (repo) => {
      // Fetch branches
      const branchResponse = await octokit.request(
        `GET /repos/${repoOwner}/${repo.name}/branches`,
        {
          owner: repoOwner,
          repo: repo.name,
          per_page: 100,
        },
      );

      // Fetch open pull request count
      const pullRequestResponse = await octokit.request(
        `GET /repos/${repoOwner}/${repo.name}/pulls`,
        {
          owner: repoOwner,
          repo: repo.name,
          per_page: 1,
          state: 'open',
        },
      );

      // Extract the total count of open pull requests from response headers
      const pullRequestCount = pullRequestResponse.headers['link']
        ? parseInt(
            pullRequestResponse.headers['link'].match(
              /&page=(\d+)>; rel="last"/,
            )[1],
          )
        : pullRequestResponse.data.length;

      // Categorize branches and get ahead/behind counts
      let categorizedBranches = {};
      for (const branch of branchResponse.data) {
        const category = categorizeBranch(branch);
        if (category) {
          const comparison = await octokit.request(
            `GET /repos/${repoOwner}/${repo.name}/compare/${repo.default_branch}...${branch.name}`,
            {
              owner: repoOwner,
              repo: repo.name,
            },
          );

          categorizedBranches[category] = {
            ahead_by: comparison.data.ahead_by,
            behind_by: comparison.data.behind_by,
          };
        }
      }

      // Sort categories to place 'production' last
      const sortedCategories = Object.entries(categorizedBranches).sort(
        ([keyA], [keyB]) => {
          if (keyA === 'production') return 1;
          if (keyB === 'production') return -1;
          return 0;
        },
      );
      categorizedBranches = Object.fromEntries(sortedCategories);

      return {
        repo: repo.name,
        branches: categorizedBranches,
        branch_count: branchResponse.data.length,
        open_pull_request_count: pullRequestCount,
      };
    });

    const comparisonBranches = await Promise.all(comparisonBranchesPromises);

    // Convert the comparisonBranches array to a structured object
    const branchData = comparisonBranches.reduce(
      (acc, { repo, branches, branch_count, open_pull_request_count }) => {
        acc[repo] = { branches, branch_count, open_pull_request_count };
        return acc;
      },
      {},
    );

    res.status(200).json(branchData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the branch data' });
  }
}
