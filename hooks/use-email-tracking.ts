import { Alert } from 'react-native';
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
      Alert.alert(Localization.email.sentSuccess);
    },

    onError: (err) => {
      console.warn('[email] Failed to confirm email sent for issue', issueId, err);
      Alert.alert(Localization.errors.generic);
    },
  });
}
