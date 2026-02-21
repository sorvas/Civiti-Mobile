export const IssueStatus = {
  Draft: 'Draft',
  Submitted: 'Submitted',
  UnderReview: 'UnderReview',
  Active: 'Active',
  Resolved: 'Resolved',
  Rejected: 'Rejected',
  Cancelled: 'Cancelled',
} as const;

export type IssueStatus = (typeof IssueStatus)[keyof typeof IssueStatus];

export const IssueCategory = {
  Infrastructure: 'Infrastructure',
  Environment: 'Environment',
  Transportation: 'Transportation',
  PublicServices: 'PublicServices',
  Safety: 'Safety',
  Other: 'Other',
} as const;

export type IssueCategory = (typeof IssueCategory)[keyof typeof IssueCategory];

export const UrgencyLevel = {
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
  Urgent: 'Urgent',
} as const;

export type UrgencyLevel = (typeof UrgencyLevel)[keyof typeof UrgencyLevel];
