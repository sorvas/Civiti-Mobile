import { toast } from 'burnt';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Localization } from '@/constants/localization';
import { confirmEmailSent } from '@/services/issues';

export function useEmailTracking(issueId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => confirmEmailSent(issueId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues', 'detail', issueId] });
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      toast({
        title: Localization.email.sentSuccess,
        preset: 'done',
      });
    },

    onError: (err) => {
      console.warn('[email] Failed to confirm email sent for issue', issueId, err);
      toast({
        title: Localization.errors.generic,
        preset: 'error',
      });
    },
  });
}
