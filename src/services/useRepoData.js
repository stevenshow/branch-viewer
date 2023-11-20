import { useState } from 'react';

const useRepoData = (team, repoOwner) => {
  const [repoData, setRepoData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleButtonClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      setRepoData({});
      const data = await fetch(
        `/api/git?repoOwner=${repoOwner}&team=${team}`,
      ).then((response) => response.json());

      setRepoData(data);
    } catch (error) {
      setError(error);
    }

    setIsLoading(false);
  };

  return { repoData, isLoading, error, handleButtonClick };
};

export default useRepoData;
