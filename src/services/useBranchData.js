import { useState } from 'react';

const useBranchData = (repos, repoOwner) => {
	const [branchData, setBranchData] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

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

	return { branchData, isLoading, error, handleButtonClick };
};

export default useBranchData;
