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
import { denormalizeBody, denormalizeParams, normalizeIssueDetail, normalizePagedIssues } from './normalize-issue';

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

export async function getUserIssues(
  params?: GetUserIssuesParams,
): Promise<PagedResult<IssueListResponse>> {
  const page = await apiClient<PagedResult<IssueListResponse>>('/user/issues', { params: denormalizeParams(params) });
  return normalizePagedIssues(page);
}

export async function updateUserIssue(
  id: string,
  data: UpdateIssueRequest,
): Promise<IssueDetailResponse> {
  const issue = await apiClient<IssueDetailResponse>(`/user/issues/${id}`, { method: 'PUT', body: denormalizeBody(data) });
  return normalizeIssueDetail(issue);
}

export function updateUserIssueStatus(
  id: string,
  data: UpdateIssueStatusRequest,
): Promise<void> {
  return apiClient(`/user/issues/${id}/status`, { method: 'PUT', body: denormalizeBody(data) });
}

export function getUserGamification(): Promise<UserGamificationResponse> {
  return apiClient('/user/gamification');
}
