import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getUserIssues } from '@/services/user';
import { useAuth } from '@/store/auth-context';
import type { GetUserIssuesParams } from '@/types/issues';

type UseUserIssuesParams = Omit<GetUserIssuesParams, 'page' | 'pageSize'>;

const PAGE_SIZE = 12;

export function useUserIssues(params?: UseUserIssuesParams) {
  const { session } = useAuth();

  const query = useInfiniteQuery({
    queryKey: ['user', 'issues', params],
    queryFn: ({ pageParam }) =>
      getUserIssues({
        ...params,
        page: pageParam,
        pageSize: PAGE_SIZE,
        sortBy: params?.sortBy ?? 'createdAt',
        sortDescending: params?.sortDescending ?? true,
      }),
    initialPageParam: 1,
    maxPages: 10,
    enabled: !!session,
    staleTime: 60_000,
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
