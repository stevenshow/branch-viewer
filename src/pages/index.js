import { useState } from 'react';
import Repo from '../components/repo';
import useBranchData from '../services/useBranchData';
import { getStatusText, getStatusColorClass } from '../utils/statusUtils';
import { repos, repoOwner } from '../data/repoConfig';

export default function Home() {
	const { branchData, isLoading, error, handleButtonClick } = useBranchData(
		repos,
		repoOwner
	);

	return (
		<div className='flex flex-col'>
			<h1 className='text-2xl mb-4 m-auto'>Red Team Branch Comparisons</h1>
			<button
				onClick={handleButtonClick}
				className='border-2 border-blue-500 text-blue-500 px-4 py-2 rounded hover:border-opacity-70 hover:text-opacity-70 transition m-auto'
			>
				Fetch branch data
			</button>
			{isLoading && <div className='mt-4 m-auto'>Loading...</div>}
			{error && <div className='mt-4 text-red-500'>Error: {error.message}</div>}
			{Object.keys(branchData).length > 0 && (
				<div className='mt-4 m-auto border-2 border-gray-300'>
					{Object.entries(branchData).map(([repoName, branches], index) => (
						<Repo
							key={repoName}
							repoName={repoName}
							branches={branches}
							repoOwner={repoOwner}
							getStatusColorClass={getStatusColorClass}
							getStatusText={getStatusText}
							repos={repos}
							index={index}
						/>
					))}
				</div>
			)}
		</div>
	);
}
