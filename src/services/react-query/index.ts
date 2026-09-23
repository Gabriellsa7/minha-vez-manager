import type { UseMutationOptions } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

const MAX_QUERY_RETRIES = 2;

const shouldRetryQuery = (failureCount: number, error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status && status >= 400 && status < 500) return false;
  }

  return failureCount < MAX_QUERY_RETRIES;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 15_000,
      retry: shouldRetryQuery,
    },
    mutations: {
      retry: false,
    },
  },
});

const invalidateQueryKeys = (queryKeys: readonly string[]) =>
  Promise.all(
    queryKeys.map((queryKey) =>
      queryClient.invalidateQueries({ queryKey: [queryKey] })
    )
  );

const isNotFoundError = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 404;

export { queryClient, invalidateQueryKeys, isNotFoundError };

const withInvalidation = <TData, TVariables>(
  queryKeys: readonly string[],
  options?: UseMutationOptions<TData, unknown, TVariables>
): UseMutationOptions<TData, unknown, TVariables> => ({
  ...options,
  onSuccess: (...args) => {
    void invalidateQueryKeys(queryKeys);
    return options?.onSuccess?.(...args);
  },
});

export { withInvalidation };
