import type { ResidenceType } from './enums';
import type { UserGamificationResponse } from './gamification';

export type UserProfileResponse = {
  id: string;
  email: string | null;
  displayName: string | null;
  photoUrl: string | null;
  county: string | null;
  city: string | null;
  district: string | null;
  residenceType: string | null;
  points: number;
  level: number;
  createdAt: string;
  emailVerified: boolean;
  issueUpdatesEnabled: boolean;
  communityNewsEnabled: boolean;
  monthlyDigestEnabled: boolean;
  achievementsEnabled: boolean;
  gamification: UserGamificationResponse | null;
}

export type CreateUserProfileRequest = {
  displayName: string;
  photoUrl?: string | null;
  county?: string | null;
  city?: string | null;
  district?: string | null;
  residenceType?: ResidenceType;
  issueUpdatesEnabled?: boolean;
  communityNewsEnabled?: boolean;
  monthlyDigestEnabled?: boolean;
  achievementsEnabled?: boolean;
}

export type UpdateUserProfileRequest = {
  displayName?: string | null;
  photoUrl?: string | null;
  county?: string | null;
  city?: string | null;
  district?: string | null;
  residenceType?: ResidenceType;
  issueUpdatesEnabled?: boolean;
  communityNewsEnabled?: boolean;
  monthlyDigestEnabled?: boolean;
  achievementsEnabled?: boolean;
}
