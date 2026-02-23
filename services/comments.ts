import type { PagedResult } from '@/types/api';
import type {
  CommentResponse,
  CommentVoteResponse,
  CreateCommentRequest,
  GetCommentsParams,
  UpdateCommentRequest,
} from '@/types/comments';

import { apiClient } from './api-client';

export function getIssueComments(
  issueId: string,
  params?: GetCommentsParams,
): Promise<PagedResult<CommentResponse>> {
  return apiClient(`/issues/${issueId}/comments`, {
    authenticated: false,
    params: { ...params },
  });
}

export function createComment(
  issueId: string,
  data: CreateCommentRequest,
): Promise<CommentResponse> {
  return apiClient(`/issues/${issueId}/comments`, {
    method: 'POST',
    body: data,
  });
}

export function getComment(id: string): Promise<CommentResponse> {
  return apiClient(`/comments/${id}`, { authenticated: false });
}

export function updateComment(
  id: string,
  data: UpdateCommentRequest,
): Promise<void> {
  return apiClient(`/comments/${id}`, { method: 'PUT', body: data });
}

export function deleteComment(id: string): Promise<void> {
  return apiClient(`/comments/${id}`, { method: 'DELETE' });
}

export function voteCommentHelpful(id: string): Promise<CommentVoteResponse> {
  return apiClient(`/comments/${id}/vote`, { method: 'POST' });
}

export function removeCommentVote(id: string): Promise<CommentVoteResponse> {
  return apiClient(`/comments/${id}/vote`, { method: 'DELETE' });
}
