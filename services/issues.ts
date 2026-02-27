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
import { denormalizeBody, denormalizeParams, normalizeIssueDetail, normalizePagedIssues } from './normalize-issue';

export async function getIssues(
  params?: GetIssuesParams,
): Promise<PagedResult<IssueListResponse>> {
  const page = await apiClient<PagedResult<IssueListResponse>>('/issues', { authenticated: false, params: denormalizeParams(params) });
  return normalizePagedIssues(page);
}

export async function getIssueById(id: string): Promise<IssueDetailResponse> {
  const issue = await apiClient<IssueDetailResponse>(`/issues/${id}`, { authenticated: false });
  return normalizeIssueDetail(issue);
}

export function createIssue(
  data: CreateIssueRequest,
): Promise<CreateIssueResponse> {
  return apiClient('/issues', { method: 'POST', body: denormalizeBody(data) });
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
  return apiClient('/issues/enhance-text', { method: 'POST', body: denormalizeBody(data) });
}

export function generateIssuePosterUrl(id: string): string {
  return `${API_BASE_URL}/issues/${id}/poster`;
}
