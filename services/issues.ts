import { API_BASE_URL } from '@/constants/api';
import type { PagedResult } from '@/types/api';
import type {
  CreateIssueRequest,
  CreateIssueResponse,
  EnhanceTextRequest,
  EnhanceTextResponse,
  GetIssuesParams,
  IssueDetailResponse,
  IssueListResponse,
} from '@/types/issues';

import { apiClient } from './api-client';

export function getIssues(
  params?: GetIssuesParams,
): Promise<PagedResult<IssueListResponse>> {
  return apiClient('/issues', { authenticated: false, params: { ...params } });
}

export function getIssueById(id: string): Promise<IssueDetailResponse> {
  return apiClient(`/issues/${id}`, { authenticated: false });
}

export function createIssue(
  data: CreateIssueRequest,
): Promise<CreateIssueResponse> {
  return apiClient('/issues', { method: 'POST', body: data });
}

export function voteForIssue(id: string): Promise<void> {
  return apiClient(`/issues/${id}/vote`, { method: 'POST' });
}

export function removeVoteFromIssue(id: string): Promise<void> {
  return apiClient(`/issues/${id}/vote`, { method: 'DELETE' });
}

export function confirmEmailSent(id: string): Promise<void> {
  return apiClient(`/issues/${id}/email-sent`, { method: 'POST' });
}

export function enhanceText(
  data: EnhanceTextRequest,
): Promise<EnhanceTextResponse> {
  return apiClient('/issues/enhance-text', { method: 'POST', body: data });
}

export function generateIssuePosterUrl(id: string): string {
  return `${API_BASE_URL}/issues/${id}/poster`;
}
