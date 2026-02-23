import type { PagedResult } from '@/types/api';
import type { UserGamificationResponse } from '@/types/gamification';
import type {
  GetUserIssuesParams,
  IssueDetailResponse,
  IssueListResponse,
  UpdateIssueRequest,
  UpdateIssueStatusRequest,
} from '@/types/issues';
import type {
  CreateUserProfileRequest,
  UpdateUserProfileRequest,
  UserProfileResponse,
} from '@/types/user';

import { apiClient } from './api-client';

export function getUserProfile(): Promise<UserProfileResponse> {
  return apiClient('/user/profile');
}

export function createUserProfile(
  data: CreateUserProfileRequest,
): Promise<UserProfileResponse> {
  return apiClient('/user/profile', { method: 'POST', body: data });
}

export function updateUserProfile(
  data: UpdateUserProfileRequest,
): Promise<UserProfileResponse> {
  return apiClient('/user/profile', { method: 'PUT', body: data });
}

export function deleteUserAccount(): Promise<void> {
  return apiClient('/user/account', { method: 'DELETE' });
}

export function getUserIssues(
  params?: GetUserIssuesParams,
): Promise<PagedResult<IssueListResponse>> {
  return apiClient('/user/issues', { params: { ...params } });
}

export function updateUserIssue(
  id: string,
  data: UpdateIssueRequest,
): Promise<IssueDetailResponse> {
  return apiClient(`/user/issues/${id}`, { method: 'PUT', body: data });
}

export function updateUserIssueStatus(
  id: string,
  data: UpdateIssueStatusRequest,
): Promise<void> {
  return apiClient(`/user/issues/${id}/status`, { method: 'PUT', body: data });
}

export function getUserGamification(): Promise<UserGamificationResponse> {
  return apiClient('/user/gamification');
}
