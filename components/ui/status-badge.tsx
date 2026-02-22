import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { IssueStatus } from '@/constants/enums';
import { Localization } from '@/constants/localization';
import { BorderRadius, Spacing } from '@/constants/spacing';

type StatusBadgeProps = {
  status: IssueStatus;
};

const STATUS_STYLES: Record<IssueStatus, { fg: string; bg: string; border: string }> = {
  Draft:       { fg: '#64748B', bg: '#F1F5F9', border: '#CBD5E1' },
  Submitted:   { fg: '#14213D', bg: '#E6F7FF', border: '#91D5FF' },
  UnderReview: { fg: '#D48806', bg: '#FFFBE6', border: '#FFE58F' },
  Active:      { fg: '#1890FF', bg: '#E6F7FF', border: '#91D5FF' },
  Resolved:    { fg: '#28A745', bg: '#DCFCE7', border: '#86EFAC' },
  Rejected:    { fg: '#DC3545', bg: '#FFF1F0', border: '#FFB8B8' },
  Cancelled:   { fg: '#64748B', bg: '#F1F5F9', border: '#CBD5E1' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors = STATUS_STYLES[status];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg, borderColor: colors.border },
      ]}
    >
      <ThemedText type="badge" style={{ color: colors.fg }}>
        {Localization.status[status]}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: Spacing.xxs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
});
