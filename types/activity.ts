import type { PaginationParams } from './api';
import type { ActivityType } from './enums';

export type ActivityResponse = {
  id: string;
  type: ActivityType;
  issueId: string;
  issueTitle: string | null;
  message: string | null;
  aggregatedCount: number;
  actorDisplayName: string | null;
  createdAt: string;
}

export type GetActivitiesParams = PaginationParams & {
  type?: ActivityType;
  since?: string;
};
