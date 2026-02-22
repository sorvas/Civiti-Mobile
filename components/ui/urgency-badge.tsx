import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { UrgencyLevel } from '@/constants/enums';
import { Localization } from '@/constants/localization';
import { BorderRadius, Spacing } from '@/constants/spacing';

type UrgencyBadgeProps = {
  level: UrgencyLevel;
};

const URGENCY_STYLES: Record<UrgencyLevel, { fg: string; bg: string }> = {
  Low:    { fg: '#28A745', bg: '#DCFCE7' },
  Medium: { fg: '#F59E0B', bg: '#FEF3C7' },
  High:   { fg: '#F97316', bg: '#FFEDD5' },
  Urgent: { fg: '#DC3545', bg: '#FFF1F0' },
};

export function UrgencyBadge({ level }: UrgencyBadgeProps) {
  const colors = URGENCY_STYLES[level];

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <ThemedText type="badge" style={{ color: colors.fg }}>
        {Localization.urgency[level]}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: Spacing.xxs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.xs,
    alignSelf: 'flex-start',
  },
});
