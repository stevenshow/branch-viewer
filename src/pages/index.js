import { useState } from 'react';

export default function Home() {
	const [branchData, setBranchData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [repos, setRepos] = useState([
		{
			repoName: 'ASSR-pptax',
			base: 'master',
			branch1: 'staging',
			branch2: 'production',
		},
		{
			repoName: 'AUD-agenda',
			base: 'master',
			branch1: 'test',
			branch2: 'production',
		},
		{
			repoName: 'CJC-assessment-form-v2',
			base: 'main',
			branch1: 'test',
			branch2: 'production',
		},
		{
			repoName: 'ROS-EFiling',
			base: 'master',
			branch1: 'test',
			branch2: 'production',
		},
		{
			repoName: 'TREAS-appeal-web-forms',
			base: 'master',
			branch1: 'staging',
			branch2: 'production',
		},
		{
			repoName: 'TREAS-mortgage-tax-payment',
			base: 'master',
			branch1: 'staging',
			branch2: 'production',
		},
		{
			repoName: 'UCSO-EM-emergency-news-feed',
			base: 'master',
			branch1: 'staging',
			branch2: 'production',
		},
	]);
	const repoOwner = 'ITDeptUtahCountyGovernment';

	const handleButtonClick = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const promises = repos.map((repo) =>
				fetch(
					`/api/git?repoOwner=${repoOwner}&repoName=${repo.repoName}&base=${repo.base}&&branch1=${repo.branch1}&branch2=${repo.branch2}`
				).then((response) => response.json())
			);
			const data = await Promise.all(promises);
			const combinedData = data.reduce((acc, repoData) => {
				return { ...acc, ...repoData };
			}, {});
			setBranchData(combinedData);
		} catch (error) {
			setError(error);
		}

		setIsLoading(false);
	};

	const getStatusText = (test, production) => {
		if (test.aheadBy > 0 || production.aheadBy > 0) {
			return 'Branch needs to be looked at because it is ahead of the base branch';
		} else if (test.behindBy === 0 && production.behindBy === 0) {
			return 'Project is up to date';
		} else if (test.behindBy > 0 && production.behindBy > 0) {
			return 'Working on changes to be pushed to staging';
		} else if (test.behindBy === 0 && production.behindBy > 0) {
			return 'Pending approval in staging';
		}
	};

	const getStatusColorClass = (statusText) => {
		switch (statusText) {
			case 'Project is up to date':
				return 'text-green-500';
			case 'Working on changes to be pushed to staging':
				return 'text-yellow-500';
			case 'Pending approval in staging':
				return 'text-blue-500';
			case 'Branch needs to be looked at because it is ahead of the base branch':
				return 'text-red-500';
			default:
				return '';
		}
	};

	return (
		<div className='flex flex-col'>
			<h1 className='text-2xl mb-4 m-auto'>Branch Comparisons</h1>
			<button
				onClick={handleButtonClick}
				className='border-2 border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition m-auto'
			>
				Fetch branch data
			</button>
			{isLoading && <div className='mt-4'>Loading...</div>}
			{error && <div className='mt-4 text-red-500'>Error: {error.message}</div>}
			<div className='mt-4'>
				{Object.entries(branchData).map(([repoName, branches], index) => {
					const branch1Data =
						branches[repos.find((repo) => repo.repoName === repoName).branch1];
					const branch2Data =
						branches[repos.find((repo) => repo.repoName === repoName).branch2];

					return (
						<div
							key={repoName}
							className={`grid grid-cols-3 gap-4 p-4 ${
								index !== 0 ? 'border-t border-gray-300' : ''
							}`}
						>
							<div>
								<a
									href={`https://github.com/${repoOwner}/${repoName}`}
									className={`text-2xl ${getStatusColorClass(
										getStatusText(branch1Data, branch2Data)
									)}`}
									target='_blank'
								>
									{repoName}
								</a>
								<div className='text-base'>
									{getStatusText(branch1Data, branch2Data)}
								</div>
							</div>
							{Object.entries(branches).map(([branchName, branch]) => (
								<div key={branchName} className='flex flex-col m-auto'>
									<div className='flex justify-center flex-col'>
										<a
											href={`https://github.com/${repoOwner}/${repoName}/tree/${branchName}`}
											className='text-xl mb-1'
											target='_blank'
										>
											{branchName}
										</a>
										<div className='flex m-auto'>
											<p className={branch.behindBy > 0 ? 'text-red-500' : ''}>
												{branch.behindBy} ←
											</p>
											<p className={branch.aheadBy > 0 ? 'text-green-500' : ''}>
												→ {branch.aheadBy}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					);
				})}
			</div>
		</div>
	);
}
