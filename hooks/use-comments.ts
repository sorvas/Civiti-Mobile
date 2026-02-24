import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getIssueComments } from '@/services/comments';
import type { GetCommentsParams } from '@/types/comments';

type UseCommentsParams = Omit<GetCommentsParams, 'page' | 'pageSize'>;

const PAGE_SIZE = 12;

export function useComments(issueId: string, params?: UseCommentsParams) {
  const query = useInfiniteQuery({
    queryKey: ['issues', issueId, 'comments', params],
    queryFn: ({ pageParam }) =>
      getIssueComments(issueId, {
        ...params,
        page: pageParam,
        pageSize: PAGE_SIZE,
        sortBy: params?.sortBy ?? 'createdAt',
        sortDescending: params?.sortDescending ?? true,
      }),
    initialPageParam: 1,
    enabled: !!issueId,
    maxPages: 5,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const comments = useMemo(
    () => query.data?.pages.flatMap((page) => page.items ?? []) ?? [],
    [query.data],
  );

  const totalComments = query.data?.pages[0]?.totalItems ?? 0;

  return {
    comments,
    totalComments,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
