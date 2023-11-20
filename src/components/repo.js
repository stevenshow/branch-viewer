const Repo = ({
  repoName,
  data,
  repoOwner,
  getStatusColorClass,
  getStatusText,
  index,
}) => {
  const { branches, open_pull_request_count, branch_count } = data;
  const stagingBranchData = branches.staging ?? branches.test;
  const productionBranchData = branches.production;
  const hasBranches = Object.keys(branches).length > 0;

  return (
    <>
      {hasBranches && (
        <section
          key={repoName}
          className={`grid grid-cols-3 p-5 sm:grid-cols-3 ${
            index !== 0 ? 'border-t border-gray-300' : ''
          }`}
        >
          <article>
            <h2>
              <a
                href={`https://github.com/${repoOwner}/${repoName}`}
                className={`text-2xl ${getStatusColorClass(
                  getStatusText(stagingBranchData, productionBranchData),
                )} hover:text-opacity-80`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {repoName}
              </a>
            </h2>
            <div className="text-xl text-white/70">
              {getStatusText(stagingBranchData, productionBranchData)}
            </div>
          </article>
          <dl className="m-auto flex flex-col">
            <div className="gap-2 sm:grid sm:grid-cols-2">
              <dt className="text-lg text-slate-200">Open PRs:</dt>
              <dd className="text-lg font-semibold">
                {open_pull_request_count}
              </dd>
            </div>
            <div className="gap-2 sm:grid sm:grid-cols-2">
              <dt className="text-lg text-slate-200">Branches:</dt>
              <dd className="text-lg font-semibold">{branch_count}</dd>
            </div>
          </dl>
          <div className="my-auto flex flex-col sm:grid sm:grid-cols-2 sm:gap-4">
            {Object.entries(branches).map(([branchName, branch]) => (
              <div key={branchName} className="flex flex-col">
                <a
                  href={`https://github.com/${repoOwner}/${repoName}/tree/${branchName}`}
                  className="text-center text-xl font-bold text-slate-300 hover:text-opacity-70"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {branchName}
                </a>
                <div className="flex justify-center text-xl">
                  <p className={branch?.behind_by > 0 ? 'text-red-400' : ''}>
                    {branch.behind_by} ←
                  </p>
                  <p className={branch?.ahead_by > 0 ? 'text-green-400' : ''}>
                    → {branch.ahead_by}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default Repo;
