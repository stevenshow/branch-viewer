import { useState } from 'react';
import Repo from '../components/repo';
import useBranchData from '../services/useBranchData';
import { getStatusText, getStatusColorClass } from '../utils/statusUtils';
import { teamNames, repoOwner } from '../data/repoConfig';
import DropDown from '@/components/dropdown';

export default function Home() {
  const [selected, setSelected] = useState('Red Team');
  const { branchData, isLoading, error, handleButtonClick } = useBranchData(
    teamNames[selected],
    repoOwner,
  );

  return (
    <div className="m-auto flex h-screen flex-col">
      <div className="m-auto flex flex-col gap-4">
        <h1 className="mb-auto text-2xl">Branch Comparisons</h1>
        <DropDown selected={selected} setSelected={setSelected} />
        <button
          onClick={handleButtonClick}
          className="m-auto rounded border-2 border-blue-500 px-4 py-2 text-blue-500 transition hover:border-opacity-70 hover:text-opacity-70"
        >
          Fetch branch data
        </button>
        {isLoading && <div className="m-auto mt-4">Loading...</div>}
      </div>
      {error && <div className="mt-4 text-red-500">Error: {error.message}</div>}
      {Object.keys(branchData).length > 0 && (
        <div className="m-auto mt-4 border-2 border-gray-300">
          {Object.entries(branchData).map(([repoName, branches], index) => (
            <Repo
              key={repoName}
              repoName={repoName}
              branches={branches}
              repoOwner={repoOwner}
              getStatusColorClass={getStatusColorClass}
              getStatusText={getStatusText}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
