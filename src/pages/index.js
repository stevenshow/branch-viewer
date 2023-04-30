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

	const handleButtonClick = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const promises = repos.map((repo) =>
				fetch(
					`/api/git?repoOwner=${'ITDeptUtahCountyGovernment'}&repoName=${
						repo.repoName
					}&base=${repo.base}&&branch1=${repo.branch1}&branch2=${repo.branch2}`
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
				{Object.entries(branchData).map(([repoName, branches], index) => (
					<div
						key={repoName}
						className={`grid grid-cols-3 gap-4 p-4 ${
							index !== 0 ? 'border-t border-gray-300' : ''
						}`}
					>
						<div className='font-semibold text-xl'>{repoName}</div>
						{Object.entries(branches).map(([branchName, branch]) => (
							<div key={branchName} className='flex flex-col m-auto'>
								<div className='flex justify-center flex-col'>
									<p className='text-xl mb-1'>{branchName}</p>
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
				))}
			</div>
		</div>
	);
}
