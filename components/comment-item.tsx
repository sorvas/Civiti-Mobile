import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Localization } from '@/constants/localization';
import { Spacing } from '@/constants/spacing';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { CommentResponse } from '@/types/comments';
import { formatTimeAgo } from '@/utils/format-time-ago';

type CommentItemProps = {
  comment: CommentResponse;
};

export function CommentItem({ comment }: CommentItemProps) {
  const textSecondary = useThemeColor({}, 'textSecondary');
  const border = useThemeColor({}, 'border');

  return (
    <View style={[styles.container, { borderBottomColor: border }]}>
      {comment.parentCommentId ? (
        <View style={styles.replyIndicator}>
          <View style={[styles.replyLine, { backgroundColor: border }]} />
        </View>
      ) : null}

      <View style={styles.row}>
        <Avatar
          uri={comment.user.photoUrl}
          name={comment.user.displayName ?? undefined}
          size={32}
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="bodyBold" style={styles.name} numberOfLines={1}>
              {comment.user.displayName ?? '?'}
            </ThemedText>
            {comment.user.level > 0 ? (
              <ThemedText type="caption" style={{ color: textSecondary }}>
                {Localization.comments.level} {comment.user.level}
              </ThemedText>
            ) : null}
            <ThemedText type="caption" style={{ color: textSecondary }}>
              · {formatTimeAgo(comment.createdAt)}
            </ThemedText>
          </View>

          {comment.isDeleted ? (
            <ThemedText type="body" style={{ color: textSecondary, fontStyle: 'italic' }}>
              {Localization.comments.deleted}
            </ThemedText>
          ) : (
            <ThemedText type="body">{comment.content}</ThemedText>
          )}

          {comment.replyCount > 0 && !comment.parentCommentId ? (
            <View style={styles.replyCount}>
              <IconSymbol name="text.bubble.fill" size={14} color={textSecondary} />
              <ThemedText type="caption" style={{ color: textSecondary }}>
                {comment.replyCount}{' '}
                {comment.replyCount === 1
                  ? Localization.comments.reply
                  : Localization.comments.replies}
              </ThemedText>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  replyIndicator: {
    paddingLeft: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  replyLine: {
    width: 2,
    height: Spacing.md,
    borderRadius: 1,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  content: {
    flex: 1,
    gap: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  name: {
    fontSize: 14,
    lineHeight: 18,
  },
  replyCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
});
