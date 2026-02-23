import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CategoryBadge } from '@/components/ui/category-badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { UrgencyBadge } from '@/components/ui/urgency-badge';
import { Localization } from '@/constants/localization';
import { BorderRadius, Shadows, Spacing } from '@/constants/spacing';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { IssueListResponse } from '@/types/issues';
import { formatTimeAgo } from '@/utils/format-time-ago';

type IssueCardProps = {
  issue: IssueListResponse;
  onPress: () => void;
};

export function IssueCard({ issue, onPress }: IssueCardProps) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const textSecondary = useThemeColor({}, 'textSecondary');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={issue.title ?? ''}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: surface, borderColor: border, opacity: pressed ? 0.9 : 1 },
        Shadows.sm,
      ]}
    >
      {/* Photo */}
      {issue.mainPhotoUrl ? (
        <Image
          source={{ uri: issue.mainPhotoUrl }}
          style={styles.photo}
          contentFit="cover"
          transition={200}
          recyclingKey={issue.id}
          accessibilityRole="image"
          accessibilityLabel={issue.title ?? 'Issue photo'}
        />
      ) : (
        <View style={[styles.photo, { backgroundColor: border }]} />
      )}

      {/* Category badge — top-left */}
      <View style={styles.categoryOverlay}>
        <CategoryBadge category={issue.category} />
      </View>

      {/* Urgency badge — top-right */}
      <View style={styles.urgencyOverlay}>
        <UrgencyBadge level={issue.urgency} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ThemedText type="h3" numberOfLines={2}>
          {issue.title}
        </ThemedText>

        {issue.address ? (
          <View style={styles.addressRow}>
            <IconSymbol name="mappin.circle.fill" size={14} color={textSecondary} />
            <ThemedText type="caption" style={{ color: textSecondary }} numberOfLines={1}>
              {issue.address}
            </ThemedText>
          </View>
        ) : null}

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <IconSymbol name="person.2.fill" size={14} color={textSecondary} />
            <ThemedText type="caption" style={{ color: textSecondary, fontVariant: ['tabular-nums'] }}>
              {issue.communityVotes} {Localization.issues.votes}
            </ThemedText>
          </View>

          <View style={styles.metaItem}>
            <IconSymbol name="envelope.fill" size={14} color={textSecondary} />
            <ThemedText type="caption" style={{ color: textSecondary, fontVariant: ['tabular-nums'] }}>
              {issue.emailsSent} {Localization.issues.emails}
            </ThemedText>
          </View>

          <ThemedText type="caption" style={[styles.timeAgo, { color: textSecondary }]}>
            {formatTimeAgo(issue.createdAt)}
          </ThemedText>
        </View>
      </View>
    </Pressable>
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
  photo: {
    height: 180,
    width: '100%',
  },
  categoryOverlay: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
  },
  urgencyOverlay: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  timeAgo: {
    marginLeft: 'auto',
  },
});
