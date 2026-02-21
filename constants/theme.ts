import type { IssueCategory, IssueStatus, UrgencyLevel } from '@/constants/enums';

// ─── Brand Palette ───────────────────────────────────────────────

export const BrandColors = {
  oxfordBlue: '#14213D',
  orangeWeb: '#FCA311',
  platinum: '#E5E5E5',
  white: '#FFFFFF',
  black: '#000000',

  // Opacity variants
  oxfordBlue90: 'rgba(20, 33, 61, 0.9)',
  oxfordBlue80: 'rgba(20, 33, 61, 0.8)',
  oxfordBlue70: 'rgba(20, 33, 61, 0.7)',
  oxfordBlue50: 'rgba(20, 33, 61, 0.5)',
  orangeWeb90: 'rgba(252, 163, 17, 0.9)',
  orangeWeb20: 'rgba(252, 163, 17, 0.2)',
} as const;

// ─── Semantic Theme Tokens ───────────────────────────────────────

export const Colors = {
  light: {
    text: '#14213D',
    textSecondary: 'rgba(20, 33, 61, 0.7)',
    background: '#E5E5E5',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    border: '#E5E5E5',
    tint: '#FCA311',
    tabIconDefault: 'rgba(20, 33, 61, 0.5)',
    tabIconSelected: '#FCA311',
    primary: '#14213D',
    accent: '#FCA311',
    success: '#28A745',
    successMuted: '#DCFCE7',
    error: '#DC3545',
    errorMuted: '#FFF1F0',
    info: '#1890FF',
    infoMuted: '#E6F7FF',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: 'rgba(236, 237, 238, 0.7)',
    background: '#151718',
    surface: '#1E2022',
    surfaceElevated: '#262A2C',
    border: '#3A3F42',
    tint: '#FCA311',
    tabIconDefault: 'rgba(236, 237, 238, 0.5)',
    tabIconSelected: '#FCA311',
    primary: '#E5E5E5',
    accent: '#FCA311',
    success: '#4ADE80',
    successMuted: '#14532D',
    error: '#F87171',
    errorMuted: '#450A0A',
    info: '#60A5FA',
    infoMuted: '#1A3A47',
  },
} as const;

// ─── Domain Color Maps ───────────────────────────────────────────

export const StatusColors: Record<IssueStatus, string> = {
  Draft: '#9CA3AF',
  Submitted: '#1890FF',
  UnderReview: '#FCA311',
  Active: '#28A745',
  Resolved: '#6B7280',
  Rejected: '#DC3545',
  Cancelled: '#9CA3AF',
};

export const CategoryColors: Record<IssueCategory, string> = {
  Infrastructure: '#F59E0B',
  Environment: '#10B981',
  Transportation: '#3B82F6',
  PublicServices: '#8B5CF6',
  Safety: '#EF4444',
  Other: '#6B7280',
};

export const UrgencyColors: Record<UrgencyLevel, string> = {
  Low: '#10B981',
  Medium: '#F59E0B',
  High: '#F97316',
  Urgent: '#EF4444',
};

// ─── Fonts ───────────────────────────────────────────────────────

export const Fonts = {
  regular: 'FiraSans_400Regular',
  semiBold: 'FiraSans_600SemiBold',
  bold: 'FiraSans_700Bold',
  extraBold: 'FiraSans_800ExtraBold',
} as const;
