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

    const baseBranches = repos.data.map((repo) => ({
      name: repo.name,
      base_branch: repo.default_branch,
    }));

    const comparisonBranchesPromises = baseBranches.map(async (branch) => {
      const response = await octokit.request(
        `GET /repos/${repoOwner}/${branch.name}/branches`,
        {
          owner: repoOwner,
          repo: branch.name,
          per_page: 100,
        },
      );

      // Categorize branches
      const categorizedBranches = response.data.reduce((acc, branch) => {
        const category = categorizeBranch(branch);
        if (category) {
          acc[category] = acc[category] || [];
          acc[category].push(branch.name);
        }
        return acc;
      }, {});

      return {
        ...branch,
        branches: categorizedBranches,
        branch_count: response.data.length,
      };
    });

    const comparisonBranches = await Promise.all(comparisonBranchesPromises);
    console.log(comparisonBranches);
    // Process each repository's branch data for comparisons
    const comparisonPromises = comparisonBranches.flatMap((repoBranch) =>
      Object.entries(repoBranch.branches).flatMap(([category, branches]) =>
        branches.map((branchName) =>
          octokit
            .request('GET /repos/{owner}/{repo}/compare/{base}...{head}', {
              owner: repoOwner,
              repo: repoBranch.name,
              base: repoBranch.base_branch,
              head: branchName,
            })
            .then((response) => ({
              repo: repoBranch.name,
              category,
              branch: branchName,
              data: response.data,
            })),
        ),
      ),
    );

    const comparisons = await Promise.all(comparisonPromises);

    const branchData = comparisons.reduce(
      (acc, { repo, branch, category, data }) => {
        const aheadBy = data.ahead_by;
        const behindBy = data.behind_by;

        // Initialize the repository object if it doesn't exist
        if (!acc[repo]) {
          acc[repo] = {};
        }

        // Assign the comparison data to the branch under the appropriate category
        acc[repo][category] = { aheadBy, behindBy };

        return acc;
      },
      {},
    );

    // Sort categories and place 'production' last
    for (const repo in branchData) {
      const sortedCategories = Object.entries(branchData[repo]).sort(
        ([keyA], [keyB]) => {
          if (keyA === 'production') return 1;
          if (keyB === 'production') return -1;
          return 0;
        },
      );

      // Update the repository data with the sorted categories
      branchData[repo] = Object.fromEntries(sortedCategories);
    }

    res.status(200).json(branchData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the branch data' });
  }
}
