export {
  IssueStatus,
  IssueCategory,
  UrgencyLevel,
} from '@/constants/enums';

import type { IssueStatus, UrgencyLevel } from '@/constants/enums';

/** API responses may include 'Unspecified' as a sentinel value. */
export type ApiIssueStatus = IssueStatus | 'Unspecified';

/** API responses may include 'Unspecified' as a sentinel value. */
export type ApiUrgencyLevel = UrgencyLevel | 'Unspecified';

export const ActivityType = {
  NewSupporters: 'NewSupporters',
  StatusChange: 'StatusChange',
  IssueApproved: 'IssueApproved',
  IssueResolved: 'IssueResolved',
  IssueCreated: 'IssueCreated',
  NewComment: 'NewComment',
} as const;

export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];

export const AdminActionType = {
  Approve: 'Approve',
  Reject: 'Reject',
  RequestChanges: 'RequestChanges',
} as const;

export type AdminActionType =
  (typeof AdminActionType)[keyof typeof AdminActionType];

export const ResidenceType = {
  Apartment: 'Apartment',
  House: 'House',
  Business: 'Business',
} as const;

export type ResidenceType = (typeof ResidenceType)[keyof typeof ResidenceType];
