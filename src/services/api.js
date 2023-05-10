import { useState, useEffect } from 'react';

export default function useApi(endpoint) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(endpoint);
        const responseData = await response.json();
        setData(responseData);
      } catch (error) {
        setError(error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [endpoint]);

  return { data, isLoading, error };
}
