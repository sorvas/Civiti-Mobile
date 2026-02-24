import type { PaginationParams, SortParams } from './api';
import type {
  ApiIssueStatus,
  ApiUrgencyLevel,
  IssueCategory,
  IssueStatus,
  UrgencyLevel,
} from './enums';

export type IssuePhotoResponse = {
  id: string;
  url: string | null;
  description: string | null;
  isPrimary: boolean;
  createdAt: string;
}

export type IssueAuthorityInput = {
  authorityId: string | null;
  customName: string | null;
  customEmail: string | null;
}

export type IssueAuthorityResponse = {
  authorityId: string | null;
  name: string | null;
  email: string | null;
  isPredefined: boolean;
}

export type UserBasicResponse = {
  id: string;
  name: string | null;
  photoUrl: string | null;
}

export type IssueListResponse = {
  id: string;
  title: string | null;
  description: string | null;
  category: IssueCategory;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  urgency: UrgencyLevel;
  emailsSent: number;
  communityVotes: number;
  hasVoted: boolean | null;
  createdAt: string;
  mainPhotoUrl: string | null;
  district: string | null;
  status: ApiIssueStatus;
}

export type IssueDetailResponse = {
  id: string;
  title: string | null;
  description: string | null;
  category: IssueCategory;
  address: string | null;
  latitude: number;
  longitude: number;
  district: string | null;
  urgency: UrgencyLevel;
  status: ApiIssueStatus;
  emailsSent: number;
  communityVotes: number;
  hasVoted: boolean | null;
  desiredOutcome: string | null;
  communityImpact: string | null;
  createdAt: string;
  updatedAt: string;
  photos: IssuePhotoResponse[] | null;
  authorities: IssueAuthorityResponse[] | null;
  user: UserBasicResponse;
}

export type CreateIssueRequest = {
  title: string;
  description: string;
  category: IssueCategory;
  address: string;
  district: string;
  authorities?: IssueAuthorityInput[] | null;
  latitude: number;
  longitude: number;
  urgency: UrgencyLevel;
  desiredOutcome?: string | null;
  communityImpact?: string | null;
  photoUrls?: string[] | null;
}

export type CreateIssueResponse = {
  id: string;
  status: string | null;
  createdAt: string;
}

export type UpdateIssueRequest = {
  title?: string | null;
  description?: string | null;
  category?: IssueCategory;
  address?: string | null;
  district?: string | null;
  authorities?: IssueAuthorityInput[] | null;
  latitude?: number | null;
  longitude?: number | null;
  urgency?: UrgencyLevel;
  desiredOutcome?: string | null;
  communityImpact?: string | null;
  photoUrls?: string[] | null;
}

export type UpdateIssueStatusRequest = {
  status: IssueStatus;
}

export type IssueActionResponse = {
  success: boolean;
  message: string | null;
  issueId: string | null;
  newStatus: string | null;
  updatedAt: string | null;
}

export type EnhanceTextRequest = {
  description: string;
  desiredOutcome?: string | null;
  communityImpact?: string | null;
  category: IssueCategory;
  location?: string | null;
}

export type EnhanceTextResponse = {
  enhancedDescription: string | null;
  enhancedDesiredOutcome: string | null;
  enhancedCommunityImpact: string | null;
  usedOriginalText: boolean;
  warning: string | null;
  isRateLimited: boolean;
}

export type IssueFilters = Pick<
  GetIssuesParams,
  'category' | 'urgency' | 'status' | 'sortBy' | 'sortDescending'
>;

export type GetIssuesParams = PaginationParams &
  SortParams & {
    category?: IssueCategory;
    urgency?: UrgencyLevel;
    status?: ApiIssueStatus;
    district?: string;
    address?: string;
  };

export type GetUserIssuesParams = PaginationParams &
  SortParams & {
    status?: ApiIssueStatus;
  };
