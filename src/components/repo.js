const Repo = ({
  repoName,
  data,
  repoOwner,
  getStatusColorClass,
  getStatusText,
  index,
}) => {
  const stagingBranchData = data.branches.staging ?? data.branches.test;
  const productionBranchData = data.branches.production;
  const hasBranches = Object.keys(data.branches).length > 0;

  return (
    <>
      {hasBranches && (
        <div
          key={repoName}
          className={`grid grid-cols-3 gap-4 p-5 ${
            index !== 0 ? 'border-t border-gray-300' : ''
          }`}
        >
          <div>
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
            <div className="text-xl text-white/70">
              {getStatusText(stagingBranchData, productionBranchData)}
            </div>
          </div>
          {Object.entries(data.branches).map(([branchName, branch]) => (
            <div key={branchName} className="m-auto flex flex-col">
              <div className="flex flex-col justify-center">
                <a
                  href={`https://github.com/${repoOwner}/${repoName}/tree/${branchName}`}
                  className="mb-1 text-center text-xl font-bold text-white/90 hover:text-gray-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {branchName}
                </a>
                <div className="m-auto flex text-xl">
                  <p className={branch?.behind_by > 0 ? 'text-red-500' : ''}>
                    {branch.behind_by} ←
                  </p>
                  <p className={branch?.ahead_by > 0 ? 'text-green-500' : ''}>
                    → {branch.ahead_by}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Repo;
