import { StyleSheet, View } from 'react-native';

import { SkeletonBlock } from '@/components/loading-skeleton';
import { BorderRadius, Shadows, Spacing } from '@/constants/spacing';
import { useThemeColor } from '@/hooks/use-theme-color';

export function IssueCardSkeleton() {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');

  return (
    <View style={[styles.card, { backgroundColor: surface, borderColor: border }, Shadows.sm]}>
      <SkeletonBlock height={180} style={styles.image} />
      <View style={styles.content}>
        <SkeletonBlock width="90%" height={20} />
        <SkeletonBlock width="60%" height={14} />
        <SkeletonBlock width="40%" height={14} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderCurve: 'continuous',
    borderWidth: 1,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 0,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
});
