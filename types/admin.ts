import type { AdminActionType, ApiIssueStatus, ApiUrgencyLevel, IssueCategory } from './enums';
import type { IssueAuthorityResponse } from './issues';

export type AdminActionResponse = {
  id: string;
  issueId: string;
  issueTitle: string | null;
  adminUserId: string | null;
  adminName: string | null;
  adminEmail: string | null;
  actionType: AdminActionType;
  notes: string | null;
  previousStatus: string | null;
  newStatus: string | null;
  createdAt: string;
}

export type AdminIssuePhotoResponse = {
  id: string;
  url: string | null;
  thumbnailUrl: string | null;
  description: string | null;
  isPrimary: boolean;
  fileSize: number | null;
  createdAt: string;
}

export type AdminIssueResponse = {
  id: string;
  title: string | null;
  category: IssueCategory;
  urgency: ApiUrgencyLevel;
  status: ApiIssueStatus;
  address: string | null;
  createdAt: string;
  photoCount: number;
  emailsSent: number;
  userName: string | null;
}

export type AdminIssueDetailResponse = {
  id: string;
  title: string | null;
  description: string | null;
  category: IssueCategory;
  urgency: ApiUrgencyLevel;
  status: ApiIssueStatus;
  address: string | null;
  latitude: number;
  longitude: number;
  district: string | null;
  desiredOutcome: string | null;
  communityImpact: string | null;
  adminNotes: string | null;
  rejectionReason: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  userPhone: string | null;
  userTotalIssues: number;
  userResolvedIssues: number;
  userPoints: number;
  photos: AdminIssuePhotoResponse[] | null;
  authorities: IssueAuthorityResponse[] | null;
  adminActions: AdminActionResponse[] | null;
  emailsSent: number;
}

export type AdminStatisticsResponse = {
  totalSubmissions: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  active: number;
  resolved: number;
  cancelled: number;
  submissionsToday: number;
  submissionsThisWeek: number;
  submissionsThisMonth: number;
  reviewedToday: number;
  reviewedThisWeek: number;
  reviewedThisMonth: number;
  averageReviewTimeHours: number;
  issuesByCategory: Record<string, number> | null;
  issuesByUrgency: Record<string, number> | null;
  totalUsers: number;
  activeUsersThisMonth: number;
  totalEmailsSent: number;
  approvalRate: number;
  resolutionRate: number;
  backlogCount: number;
  period: string | null;
  generatedAt: string;
}
