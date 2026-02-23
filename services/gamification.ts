import type {
  AchievementProgressResponse,
  AchievementResponse,
  BadgeResponse,
  GetLeaderboardParams,
  LeaderboardResponse,
} from '@/types/gamification';

import { apiClient } from './api-client';

export function getAllAchievements(): Promise<AchievementResponse[]> {
  return apiClient('/gamification/achievements', { authenticated: false });
}

export function getUserAchievements(): Promise<AchievementProgressResponse[]> {
  return apiClient('/gamification/achievements/user');
}

export function getAllBadges(): Promise<BadgeResponse[]> {
  return apiClient('/gamification/badges', { authenticated: false });
}

export function getUserBadges(): Promise<BadgeResponse[]> {
  return apiClient('/gamification/badges/user');
}

export function getGamificationLeaderboard(
  params?: GetLeaderboardParams,
): Promise<LeaderboardResponse> {
  return apiClient('/gamification/leaderboard', {
    authenticated: false,
    params: { ...params },
  });
}
