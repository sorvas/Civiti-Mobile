export type BadgeResponse = {
  id: string;
  name: string | null;
  description: string | null;
  iconUrl: string | null;
  category: string | null;
  rarity: string | null;
  requirementDescription: string | null;
  earnedAt: string | null;
  isEarned: boolean;
  nameRo: string | null;
  descriptionRo: string | null;
  categoryRo: string | null;
  rarityRo: string | null;
  requirementDescriptionRo: string | null;
}

export type AchievementResponse = {
  id: string;
  title: string | null;
  description: string | null;
  maxProgress: number;
  rewardPoints: number;
  rewardBadge: BadgeResponse;
  achievementType: string | null;
  titleRo: string | null;
  descriptionRo: string | null;
}

export type AchievementProgressResponse = {
  id: string;
  title: string | null;
  description: string | null;
  progress: number;
  maxProgress: number;
  rewardPoints: number;
  completed: boolean;
  completedAt: string | null;
  percentageComplete: number;
  titleRo: string | null;
  descriptionRo: string | null;
}

export type UserGamificationResponse = {
  points: number;
  level: number;
  issuesReported: number;
  issuesResolved: number;
  communityVotes: number;
  currentLoginStreak: number;
  longestLoginStreak: number;
  recentBadges: BadgeResponse[] | null;
  activeAchievements: AchievementProgressResponse[] | null;
  currentLevelPoints: number;
  nextLevelPoints: number;
  pointsToNextLevel: number;
  pointsInCurrentLevel: number;
  levelProgressPercentage: number;
}

export type UserInfo = {
  id: string;
  displayName: string | null;
  photoUrl: string | null;
  city: string | null;
}

export type LeaderboardEntry = {
  rank: number;
  user: UserInfo;
  points: number;
  level: number;
  issuesReported: number;
  issuesResolved: number;
  recentBadges: string[] | null;
}

export type LeaderboardResponse = {
  leaderboard: LeaderboardEntry[] | null;
  period: string | null;
  category: string | null;
  totalEntries: number;
  generatedAt: string;
}

export type GetLeaderboardParams = {
  period?: string;
  category?: string;
  limit?: number;
}
