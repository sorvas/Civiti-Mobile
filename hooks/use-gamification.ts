import { useQuery } from '@tanstack/react-query';

import { getUserGamification } from '@/services/user';
import { getUserBadges, getUserAchievements } from '@/services/gamification';
import { useAuth } from '@/store/auth-context';

export function useGamification() {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['gamification'],
    queryFn: getUserGamification,
    enabled: !!session,
    staleTime: 5 * 60_000,
  });
}

export function useUserBadges() {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['gamification', 'badges'],
    queryFn: getUserBadges,
    enabled: !!session,
    staleTime: 5 * 60_000,
  });
}

export function useUserAchievements() {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['gamification', 'achievements'],
    queryFn: getUserAchievements,
    enabled: !!session,
    staleTime: 5 * 60_000,
  });
}
