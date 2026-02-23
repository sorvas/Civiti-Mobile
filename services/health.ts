import type { HealthCheckResponse } from '@/types/health';

import { apiClient } from './api-client';

export function healthCheck(): Promise<HealthCheckResponse> {
  return apiClient('/health', { authenticated: false });
}
