import { useQuery } from '@tanstack/react-query';

import { getUserProfile } from '@/services/user';
import { useAuth } from '@/store/auth-context';

export function useProfile() {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: getUserProfile,
    enabled: !!session,
    staleTime: 5 * 60 * 1000,
  });
}
