import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeVoteFromIssue, voteForIssue } from '@/services/issues';
import type { IssueDetailResponse } from '@/types/issues';

export function useVote(issueId: string) {
  const queryClient = useQueryClient();
  const detailKey = ['issues', 'detail', issueId];

  return useMutation({
    mutationFn: (hasVoted: boolean) =>
      hasVoted ? removeVoteFromIssue(issueId) : voteForIssue(issueId),

    onMutate: async (hasVoted: boolean) => {
      await queryClient.cancelQueries({ queryKey: detailKey });

      const previous = queryClient.getQueryData<IssueDetailResponse>(detailKey);

      queryClient.setQueryData<IssueDetailResponse>(detailKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          hasVoted: !hasVoted,
          communityVotes: old.communityVotes + (hasVoted ? -1 : 1),
        };
      });

      return { previous };
    },

    onError: (err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(detailKey, context.previous);
      }
      console.warn('[vote] Failed to toggle vote for issue', issueId, err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });
}
