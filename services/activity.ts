import type { PagedResult } from '@/types/api';
import type { ActivityResponse, GetActivitiesParams } from '@/types/activity';

import { apiClient } from './api-client';

export function getRecentActivities(
  params?: GetActivitiesParams,
): Promise<PagedResult<ActivityResponse>> {
  return apiClient('/activity', { authenticated: false, params: { ...params } });
}

export function getUserActivities(
  params?: GetActivitiesParams,
): Promise<PagedResult<ActivityResponse>> {
  return apiClient('/activity/my', { params: { ...params } });
}
