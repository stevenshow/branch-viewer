const Repo = ({
  repoName,
  branches,
  repoOwner,
  getStatusColorClass,
  getStatusText,
  repos,
  index,
}) => {
  const branch1Data =
    branches[repos.find((repo) => repo.repoName === repoName).branch1];
  const branch2Data =
    branches[repos.find((repo) => repo.repoName === repoName).branch2];

  return (
    <div
      key={repoName}
      className={`grid grid-cols-3 gap-4 p-5 ${
        index !== 0 ? "border-t border-gray-300" : ""
      }`}
    >
      <div>
        <a
          href={`https://github.com/${repoOwner}/${repoName}`}
          className={`text-2xl ${getStatusColorClass(
            getStatusText(branch1Data, branch2Data)
          )} hover:text-opacity-70`}
          target="_blank"
        >
          {repoName}
        </a>
        <div className="text-xl">{getStatusText(branch1Data, branch2Data)}</div>
      </div>
      {Object.entries(branches).map(([branchName, branch]) => (
        <div key={branchName} className="m-auto flex flex-col">
          <div className="flex flex-col justify-center">
            <a
              href={`https://github.com/${repoOwner}/${repoName}/tree/${branchName}`}
              className="mb-1 text-center text-xl font-bold hover:text-gray-300"
              target="_blank"
            >
              {branchName}
            </a>
            <div className="m-auto flex text-xl">
              <p className={branch.behindBy > 0 ? "text-red-500" : ""}>
                {branch.behindBy} ←
              </p>
              <p className={branch.aheadBy > 0 ? "text-green-500" : ""}>
                → {branch.aheadBy}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Repo;
