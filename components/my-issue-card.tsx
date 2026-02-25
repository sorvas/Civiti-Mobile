import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from '@/components/ui/category-badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { StatusBadge } from '@/components/ui/status-badge';
import { UrgencyBadge } from '@/components/ui/urgency-badge';
import type { IssueStatus } from '@/constants/enums';
import { Localization } from '@/constants/localization';
import { BorderRadius, Shadows, Spacing } from '@/constants/spacing';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { IssueListResponse } from '@/types/issues';
import { formatTimeAgo } from '@/utils/format-time-ago';

// Statuses where the user can edit
const EDITABLE_STATUSES: IssueStatus[] = ['Draft', 'Submitted', 'Rejected'];

function isValidIssueStatus(s: string): s is IssueStatus {
  return ['Draft', 'Submitted', 'UnderReview', 'Active', 'Resolved', 'Rejected', 'Cancelled'].includes(s);
}

type MyIssueCardProps = {
  issue: IssueListResponse;
  onPress: () => void;
  onEdit: () => void;
};

export function MyIssueCard({ issue, onPress, onEdit }: MyIssueCardProps) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const textSecondary = useThemeColor({}, 'textSecondary');

  const statusString = issue.status;
  const isEditable =
    isValidIssueStatus(statusString) &&
    (EDITABLE_STATUSES as string[]).includes(statusString);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={issue.title || 'Issue card'}
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
        {/* Status badge — always visible */}
        {isValidIssueStatus(statusString) ? (
          <StatusBadge status={statusString} />
        ) : null}

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

        {/* Edit button — only for editable statuses */}
        {isEditable ? (
          <Button
            variant="secondary"
            size="small"
            title={Localization.actions.edit}
            onPress={onEdit}
            style={styles.editButton}
          />
        ) : null}
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
  editButton: {
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
});
