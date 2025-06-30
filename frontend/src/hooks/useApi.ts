import { useState, useCallback } from 'react';

interface ApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

interface ApiState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

interface UseApiResponse<T> extends ApiState<T> {
  execute: (url: string, options?: ApiOptions) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T>(): UseApiResponse<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      loading: false,
    });
  }, []);

  const execute = useCallback(async (url: string, options: ApiOptions = {}): Promise<T | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        let errorMessage = 'An error occurred';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || `Error: ${response.status}`;
        } catch {
          errorMessage = `HTTP Error: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return null;
    }
  }, []);

  return { ...state, execute, reset };
}

// Example usage:
/*
const MyComponent = () => {
  const { data, error, loading, execute } = useApi<MyDataType>();

  const handleSubmit = async () => {
    const result = await execute('http://localhost:8000/api/endpoint', {
      method: 'POST',
      body: { key: 'value' }
    });
    if (result) {
      // Handle success
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!data) return null;

  return <div>{data}</div>;
};
*/ 