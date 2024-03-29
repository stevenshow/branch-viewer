import { useState } from 'react';
import Repo from '../components/repo';
import useRepoData from '../services/useRepoData';
import { getStatusText, getStatusColorClass } from '../utils/statusUtils';
import { teamNames, repoOwner } from '../data/repoConfig';
import DropDown from '@/components/dropdown';
import LoadingComponent from '@/components/loading';

export default function Home() {
  const [selected, setSelected] = useState('Red Team');
  const { repoData, isLoading, error, handleButtonClick } = useRepoData(
    teamNames[selected],
    repoOwner,
  );

  return (
    <main className="m-auto my-4 flex h-full flex-col">
      <div className="mb-4 flex flex-col flex-wrap items-center justify-between gap-4">
        <h1 className="m-auto text-2xl text-slate-100">Branch Comparisons</h1>
        <div className="m-auto flex items-center gap-4">
          <DropDown selected={selected} setSelected={setSelected} />
          <button
            onClick={handleButtonClick}
            className="rounded border border-blue-400 px-4 py-1.5 text-blue-300 transition hover:border-opacity-70 hover:text-opacity-70"
          >
            Fetch branch data
          </button>
        </div>
        {isLoading && <LoadingComponent />}
      </div>
      {error && <div className="mt-4 text-red-500">Error: {error.message}</div>}
      {Object.keys(repoData).length > 0 && (
        <div className="m-auto mt-4 rounded-md border border-gray-300 bg-slate-900/60">
          {Object.entries(repoData).map(([repoName, data]) => (
            <Repo
              key={repoName}
              repoName={repoName}
              data={data}
              repoOwner={repoOwner}
              getStatusColorClass={getStatusColorClass}
              getStatusText={getStatusText}
            />
          ))}
        </div>
      )}
    </main>
  );
}
