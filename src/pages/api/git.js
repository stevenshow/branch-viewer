import { Octokit } from "@octokit/core";

export default async function handler(req, res) {
  const { repoOwner, repoName, base, branch1, branch2 } = req.query;
  const accessToken = process.env.API_KEY;

  const octokit = new Octokit({
    auth: accessToken,
  });

  try {
    const branchNames = [branch1, branch2];
    const baseBranch = base;

    const comparisonPromises = branchNames.map((branchName) =>
      octokit.request("GET /repos/{owner}/{repo}/compare/{base}...{head}", {
        owner: repoOwner,
        repo: repoName,
        base: baseBranch,
        head: branchName,
      })
    );

    const comparisons = await Promise.all(comparisonPromises);

    const branchData = comparisons.reduce((acc, comparison, index) => {
      const aheadBy = comparison.data.ahead_by;
      const behindBy = comparison.data.behind_by;
      const branchName = branchNames[index];

      if (!acc[repoName]) {
        acc[repoName] = {};
      }
      acc[repoName][branchName] = { aheadBy, behindBy };

      return acc;
    }, {});

    res.status(200).json(branchData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the branch data" });
  }
}
