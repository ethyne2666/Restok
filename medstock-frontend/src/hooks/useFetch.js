import { useCallback, useEffect, useState } from 'react';
import { api } from '@/utils/api';

export function useFetch(path, { pollMs } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setData(await api.get(path));
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [path]);

  useEffect(() => {
    load();
    if (!pollMs) return undefined;
    const id = setInterval(load, pollMs);
    return () => clearInterval(id);
  }, [load, pollMs]);

  return { data, error, isLoading, reload: load };
}
