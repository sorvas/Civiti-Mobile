import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ProgressBar } from '@/components/ui/progress-bar';
import { BorderRadius, Shadows, Spacing } from '@/constants/spacing';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { AchievementProgressResponse } from '@/types/gamification';

type AchievementCardProps = {
  achievement: AchievementProgressResponse;
};

export function AchievementCard({ achievement }: AchievementCardProps) {
  const surfaceColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const successColor = useThemeColor({}, 'success');

  const safePercentage = Number.isFinite(achievement.percentageComplete)
    ? achievement.percentageComplete
    : 0;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: surfaceColor,
          borderColor,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          {achievement.completed && (
            <IconSymbol name="checkmark.circle.fill" size={18} color={successColor} />
          )}
          <ThemedText type="bodyBold" style={styles.title} numberOfLines={1}>
            {achievement.titleRo ?? achievement.title ?? ''}
          </ThemedText>
        </View>
        <ThemedText type="caption">
          {safePercentage}%
        </ThemedText>
      </View>
      <ProgressBar progress={safePercentage / 100} />
      <ThemedText type="caption">
        {achievement.progress ?? 0}/{achievement.maxProgress ?? 0}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderCurve: 'continuous',
    borderWidth: 1,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  title: {
    flex: 1,
  },
});
