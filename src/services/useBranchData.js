import { useState } from 'react';

const useBranchData = (team, repoOwner) => {
  const [branchData, setBranchData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleButtonClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetch(
        `/api/git?repoOwner=${repoOwner}&team=${team}`,
      ).then((response) => response.json());

      setBranchData(data);
    } catch (error) {
      setError(error);
    }

    setIsLoading(false);
  };

  return { branchData, isLoading, error, handleButtonClick };
};

export default useBranchData;
