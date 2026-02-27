import { StyleSheet, View } from 'react-native';

import { SkeletonBlock } from '@/components/loading-skeleton';
import { BorderRadius, Spacing } from '@/constants/spacing';

export function ProfileSkeleton() {
  return (
    <View style={styles.container}>
      {/* Avatar + name + email */}
      <View style={styles.header}>
        <SkeletonBlock width={80} height={80} style={styles.avatar} />
        <SkeletonBlock width="50%" height={28} />
        <SkeletonBlock width="40%" height={16} />
        <SkeletonBlock width={80} height={24} />
      </View>

      {/* Level progress bar */}
      <SkeletonBlock height={8} />

      {/* Stats 2×2 grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <SkeletonBlock height={80} style={styles.statCard} />
          <SkeletonBlock height={80} style={styles.statCard} />
        </View>
        <View style={styles.statsRow}>
          <SkeletonBlock height={80} style={styles.statCard} />
          <SkeletonBlock height={80} style={styles.statCard} />
        </View>
      </View>

      {/* Badges row */}
      <SkeletonBlock width="40%" height={20} />
      <View style={styles.badgesRow}>
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} width={60} height={60} style={styles.badgeCircle} />
        ))}
      </View>

      {/* Achievements */}
      <SkeletonBlock width="45%" height={20} />
      <SkeletonBlock height={72} />
      <SkeletonBlock height={72} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    borderRadius: BorderRadius.full,
  },
  statsGrid: {
    gap: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.sm,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  badgeCircle: {
    borderRadius: BorderRadius.full,
  },
});
