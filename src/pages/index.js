import { useState } from 'react';
import Repo from '../components/repo';
import useRepoData from '../services/useRepoData';
import { getStatusText, getStatusColorClass } from '../utils/statusUtils';
import { teamNames, repoOwner } from '../data/repoConfig';
import DropDown from '@/components/dropdown';

export default function Home() {
  const [selected, setSelected] = useState('Red Team');
  const { repoData, isLoading, error, handleButtonClick } = useRepoData(
    teamNames[selected],
    repoOwner,
  );

  return (
    <div className="m-auto flex h-full flex-col">
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
      {Object.keys(repoData).length > 0 && (
        <div className="m-auto mt-4 border-2 border-gray-300">
          {Object.entries(repoData).map(([repoName, data], index) => (
            <Repo
              key={repoName}
              repoName={repoName}
              data={data}
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
