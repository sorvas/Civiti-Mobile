import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getIssues } from '@/services/issues';
import type { GetIssuesParams } from '@/types/issues';

type UseIssuesParams = Omit<GetIssuesParams, 'page' | 'pageSize'>;

const PAGE_SIZE = 12;

export function useIssues(params?: UseIssuesParams) {
  const query = useInfiniteQuery({
    queryKey: ['issues', params],
    queryFn: ({ pageParam }) =>
      getIssues({
        ...params,
        page: pageParam,
        pageSize: PAGE_SIZE,
        sortBy: params?.sortBy ?? 'createdAt',
        sortDescending: params?.sortDescending ?? true,
      }),
    initialPageParam: 1,
    maxPages: 10,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.page > 1 ? firstPage.page - 1 : undefined,
  });

  const issues = useMemo(
    () => query.data?.pages.flatMap((page) => page.items ?? []) ?? [],
    [query.data],
  );

  return {
    issues,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}
