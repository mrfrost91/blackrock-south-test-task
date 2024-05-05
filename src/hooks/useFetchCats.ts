import { useCallback, useEffect, useState } from 'react';
import { CATS_FETCH_URL } from '../constants';

type DataItem = {
  id: string,
  url: string,
  width: number,
  height: number,
}

type Data = DataItem[];

type UseFetchCatsParams = {
  onStart?: () => void,
  onError?: () => void,
  onFinally?: () => void,
  onSuccess?: () => void,
}

const useFetchCats = ({
  onStart,
  onError,
  onFinally,
  onSuccess,
}: UseFetchCatsParams) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState<number>(() => Date.now());

  const retry = useCallback(() => {
    setRetryTrigger(Date.now());
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    onStart && onStart();
    fetch(CATS_FETCH_URL)
      .then((fetchedData) => {
        if (!fetchedData.ok) {
          throw new Error('Something went wrong');
        }

        return fetchedData.json();
      })
      .then((parsedData) => {
        setData(parsedData);
        onSuccess && onSuccess();
      })
      .catch((fetchError) => {
        setError(fetchError.message);
        onError && onError();
      })
      .finally(() => {
        setIsLoading(false);
        onFinally && onFinally();
      })
  }, [retryTrigger, onStart, onError, onFinally, onSuccess]);

  return { data, error, isLoading, retry };
};

export default useFetchCats;
