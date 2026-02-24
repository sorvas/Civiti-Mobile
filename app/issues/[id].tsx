import { toast } from 'burnt';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthorityCard } from '@/components/authority-card';
import { CommentItem } from '@/components/comment-item';
import { EmailPrompt } from '@/components/email-prompt';
import { ErrorState } from '@/components/error-state';
import { LocationPreview } from '@/components/location-preview';
import { PhotoGallery } from '@/components/photo-gallery';
import { ThemedText } from '@/components/themed-text';
import { VoteButton } from '@/components/vote-button';
import { Button } from '@/components/ui/button';
import type { BottomSheetMethods } from '@/components/ui/bottom-sheet';
import { CategoryBadge } from '@/components/ui/category-badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { StatusBadge } from '@/components/ui/status-badge';
import { UrgencyBadge } from '@/components/ui/urgency-badge';
import { IssueStatus } from '@/constants/enums';
import { Localization } from '@/constants/localization';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { BrandColors } from '@/constants/theme';
import { useComments } from '@/hooks/use-comments';
import { useEmailTracking } from '@/hooks/use-email-tracking';
import { useIssueDetail } from '@/hooks/use-issue-detail';
import { useProfile } from '@/hooks/use-profile';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/store/auth-context';
import type { IssueAuthorityResponse, IssueDetailResponse } from '@/types/issues';
import { buildMailto } from '@/utils/build-mailto';
import { formatTimeAgo } from '@/utils/format-time-ago';

const NOOP = () => {};

function isValidIssueStatus(s: string): s is (typeof IssueStatus)[keyof typeof IssueStatus] {
  return (Object.values(IssueStatus) as string[]).includes(s);
}

// ─── Sub-components ─────────────────────────────────────────────

function DetailHeader({ onBack, onShare }: { onBack: () => void; onShare: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
      <Pressable
        onPress={onBack}
        style={styles.headerButton}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={Localization.actions.back}
      >
        <IconSymbol name="chevron.left" size={24} color={BrandColors.white} />
      </Pressable>
      <Pressable
        onPress={onShare}
        style={styles.headerButton}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={Localization.detail.share}
      >
        <IconSymbol name="square.and.arrow.up" size={24} color={BrandColors.white} />
      </Pressable>
    </View>
  );
}

function TitleSection({ issue }: { issue: IssueDetailResponse }) {
  const textSecondary = useThemeColor({}, 'textSecondary');

  return (
    <View style={styles.section}>
      <ThemedText type="h1">{issue.title ?? '—'}</ThemedText>

      <View style={styles.badgeRow}>
        {isValidIssueStatus(issue.status) ? (
          <StatusBadge status={issue.status} />
        ) : null}
        <CategoryBadge category={issue.category} />
        <UrgencyBadge level={issue.urgency} />
      </View>

      <View style={styles.metaRow}>
        <IconSymbol name="clock.fill" size={14} color={textSecondary} />
        <ThemedText type="caption" style={{ color: textSecondary }}>
          {formatTimeAgo(issue.createdAt)}
        </ThemedText>
        <ThemedText type="caption" style={{ color: textSecondary }}>
          · {Localization.detail.submittedBy}{' '}
          {issue.user.name ?? '?'}
        </ThemedText>
      </View>
    </View>
  );
}

function StatisticsRow({ issue }: { issue: IssueDetailResponse }) {
  const border = useThemeColor({}, 'border');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const accent = useThemeColor({}, 'accent');

  const stats = [
    { label: Localization.detail.emailsSent, value: issue.emailsSent, color: accent },
    { label: Localization.detail.votes, value: issue.communityVotes, color: accent },
    {
      label: Localization.detail.authoritiesCount,
      value: issue.authorities?.length ?? 0,
      color: accent,
    },
  ];

  return (
    <View style={[styles.statsRow, { borderColor: border }]}>
      {stats.map((stat, index) => (
        <View
          key={stat.label}
          style={[
            styles.statItem,
            index < stats.length - 1 && { borderRightWidth: 1, borderRightColor: border },
          ]}
        >
          <ThemedText type="h2" style={{ color: stat.color, fontVariant: ['tabular-nums'] }}>
            {stat.value}
          </ThemedText>
          <ThemedText type="caption" style={{ color: textSecondary }}>
            {stat.label}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

function SectionBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <ThemedText type="h2">{title}</ThemedText>
      {children}
    </View>
  );
}

function AuthoritiesSection({
  authorities,
  onSendEmail,
}: {
  authorities: IssueAuthorityResponse[];
  onSendEmail: (authority: IssueAuthorityResponse) => void;
}) {
  return (
    <SectionBlock title={Localization.detail.authorities}>
      <View style={styles.authorityList}>
        {authorities.map((auth, index) => (
          <AuthorityCard
            key={auth.authorityId ?? `custom-${index}`}
            authority={auth}
            onSendEmail={onSendEmail}
          />
        ))}
      </View>
    </SectionBlock>
  );
}

function CommentsSection({ issueId }: { issueId: string }) {
  const [sortNewest, setSortNewest] = useState(true);
  const textSecondary = useThemeColor({}, 'textSecondary');
  const accent = useThemeColor({}, 'accent');

  const {
    comments, totalComments, hasNextPage, fetchNextPage,
    isFetchingNextPage, isLoading, isError, error: commentsError, refetch,
  } = useComments(issueId, {
    sortBy: 'createdAt',
    sortDescending: sortNewest,
  });

  const toggleSort = useCallback(() => {
    setSortNewest((prev) => !prev);
  }, []);

  const handleLoadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  return (
    <SectionBlock title={`${Localization.comments.title} (${totalComments})`}>
      {totalComments > 0 ? (
        <Pressable onPress={toggleSort} style={styles.sortToggle} accessibilityRole="button">
          <ThemedText type="caption" style={{ color: accent }}>
            {sortNewest
              ? Localization.comments.sortNewest
              : Localization.comments.sortOldest}
          </ThemedText>
        </Pressable>
      ) : null}

      {isLoading ? (
        <ActivityIndicator style={styles.commentLoader} />
      ) : isError ? (
        <ErrorState message={commentsError?.message} onRetry={refetch} />
      ) : comments.length === 0 ? (
        <ThemedText type="caption" style={{ color: textSecondary }}>
          {Localization.states.emptyComments}
        </ThemedText>
      ) : (
        <>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
          {hasNextPage ? (
            <Pressable
              onPress={handleLoadMore}
              disabled={isFetchingNextPage}
              style={styles.loadMore}
              accessibilityRole="button"
            >
              {isFetchingNextPage ? (
                <ActivityIndicator size="small" />
              ) : (
                <ThemedText type="link" style={{ color: accent }}>
                  {Localization.comments.loadMore}
                </ThemedText>
              )}
            </Pressable>
          ) : null}
        </>
      )}
    </SectionBlock>
  );
}

function StickyBottomBar({
  issueId,
  hasVoted,
  voteCount,
  onEmailCta,
  emailDisabled,
}: {
  issueId: string;
  hasVoted: boolean;
  voteCount: number;
  onEmailCta: () => void;
  emailDisabled: boolean;
}) {
  const insets = useSafeAreaInsets();
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');

  return (
    <View
      style={[
        styles.bottomBar,
        {
          backgroundColor: surface,
          borderTopColor: border,
          paddingBottom: insets.bottom || Spacing.md,
        },
      ]}
    >
      <VoteButton issueId={issueId} hasVoted={hasVoted} voteCount={voteCount} />
      <Button
        title={Localization.detail.sendEmail}
        variant="primary"
        onPress={onEmailCta}
        disabled={emailDisabled}
        style={styles.ctaButton}
      />
    </View>
  );
}

function DetailSkeleton() {
  const border = useThemeColor({}, 'border');
  const surface = useThemeColor({}, 'surface');

  return (
    <View style={styles.skeleton}>
      <View style={[styles.skeletonPhoto, { backgroundColor: border }]} />
      <View style={styles.skeletonContent}>
        <View style={[styles.skeletonLine, { width: '80%', backgroundColor: border }]} />
        <View style={[styles.skeletonLine, { width: '60%', backgroundColor: border }]} />
        <View style={[styles.skeletonLine, { width: '40%', backgroundColor: border }]} />
        <View style={[styles.skeletonBlock, { backgroundColor: surface, borderColor: border }]} />
      </View>
    </View>
  );
}

// ─── Main Screen ────────────────────────────────────────────────

export default function IssueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const scrollViewRef = useRef<ScrollView>(null);
  const authoritiesYRef = useRef(0);

  const { requireAuth } = useAuth();
  const { data: issue, isLoading, isError, error, refetch } = useIssueDetail(id);
  const { data: profile } = useProfile();
  const { mutate: trackEmailSent } = useEmailTracking(id);

  // Email flow state
  const emailPromptRef = useRef<BottomSheetMethods>(null);
  const emailFlowActiveRef = useRef(false);

  // Detect return from email client via AppState
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active' && emailFlowActiveRef.current) {
        emailFlowActiveRef.current = false;
        timeoutId = setTimeout(() => {
          emailPromptRef.current?.snapToIndex(0);
        }, 300);
      }
    });
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      subscription.remove();
    };
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleShare = useCallback(async () => {
    if (!issue) return;
    try {
      await Share.share({
        title: issue.title ?? 'Issue',
        message: `${issue.title ?? 'Issue'}\n${issue.description ?? ''}`,
        ...(Platform.OS === 'ios' ? { url: `civiti://issues/${issue.id}` } : {}),
      });
    } catch (err) {
      console.warn('[share] Share failed for issue', issue.id, err);
    }
  }, [issue]);

  const handleScrollToAuthorities = useCallback(() => {
    scrollViewRef.current?.scrollTo({
      y: authoritiesYRef.current,
      animated: true,
    });
  }, []);

  const handleAuthoritiesLayout = useCallback(
    (event: { nativeEvent: { layout: { y: number } } }) => {
      authoritiesYRef.current = event.nativeEvent.layout.y;
    },
    [],
  );

  // Email flow: triggered from authority card or bottom bar CTA
  const handleSendEmail = useCallback(
    (authority: IssueAuthorityResponse) => {
      if (!issue || !authority.email) return;
      requireAuth(() => {
        const mailto = buildMailto({
          authority,
          issue,
          userName: profile?.displayName ?? null,
        });
        Linking.openURL(mailto)
          .then(() => {
            emailFlowActiveRef.current = true;
          })
          .catch((err) => {
            console.warn('[email] Failed to open mailto link for issue', issue.id, err);
            toast({
              title: Localization.email.openFailed,
              preset: 'error',
            });
          });
      });
    },
    [issue, requireAuth, profile?.displayName],
  );

  // Bottom bar CTA: single authority → send directly, multiple → scroll to section
  const handleEmailCta = useCallback(() => {
    if (!issue) return;
    const authorities = issue.authorities ?? [];
    const withEmail = authorities.filter((a) => a.email);
    if (withEmail.length === 0) return;
    if (withEmail.length === 1) {
      handleSendEmail(withEmail[0]);
    } else {
      handleScrollToAuthorities();
    }
  }, [issue, handleSendEmail, handleScrollToAuthorities]);

  const handleEmailConfirm = useCallback(() => {
    emailPromptRef.current?.close();
    trackEmailSent();
  }, [trackEmailSent]);

  const handleEmailDismiss = useCallback(() => {
    emailPromptRef.current?.close();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <DetailHeader onBack={handleBack} onShare={NOOP} />
        <DetailSkeleton />
      </View>
    );
  }

  if (isError || !issue) {
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <View style={{ paddingTop: insets.top + Spacing.sm }}>
          <Pressable onPress={handleBack} style={styles.backButtonError}>
            <IconSymbol name="chevron.left" size={24} color={textColor} />
          </Pressable>
        </View>
        <ErrorState
          message={error?.message}
          onRetry={refetch}
        />
      </View>
    );
  }

  const photos = issue.photos ?? [];
  const authorities = issue.authorities ?? [];
  const hasVoted = issue.hasVoted ?? false;
  const hasAuthorityWithEmail = authorities.some((a) => a.email);

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo Gallery */}
        <PhotoGallery photos={photos} />

        {/* Overlay header — positioned over gallery */}
        <DetailHeader onBack={handleBack} onShare={handleShare} />

        {/* Title + Badges + Meta */}
        <TitleSection issue={issue} />

        {/* Statistics */}
        <StatisticsRow issue={issue} />

        {/* Description */}
        {issue.description ? (
          <SectionBlock title={Localization.detail.description}>
            <ThemedText type="body">{issue.description}</ThemedText>
          </SectionBlock>
        ) : null}

        {/* Desired Outcome */}
        {issue.desiredOutcome ? (
          <SectionBlock title={Localization.detail.desiredOutcome}>
            <ThemedText type="body">{issue.desiredOutcome}</ThemedText>
          </SectionBlock>
        ) : null}

        {/* Community Impact */}
        {issue.communityImpact ? (
          <SectionBlock title={Localization.detail.communityImpact}>
            <ThemedText type="body">{issue.communityImpact}</ThemedText>
          </SectionBlock>
        ) : null}

        {/* Location */}
        <SectionBlock title={Localization.detail.location}>
          <LocationPreview
            latitude={issue.latitude}
            longitude={issue.longitude}
            address={issue.address}
          />
        </SectionBlock>

        {/* Authorities */}
        {authorities.length > 0 ? (
          <View onLayout={handleAuthoritiesLayout}>
            <AuthoritiesSection
              authorities={authorities}
              onSendEmail={handleSendEmail}
            />
          </View>
        ) : null}

        {/* Comments */}
        <CommentsSection issueId={issue.id} />

        {/* Bottom spacer for sticky bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <StickyBottomBar
        issueId={issue.id}
        hasVoted={hasVoted}
        voteCount={issue.communityVotes}
        onEmailCta={handleEmailCta}
        emailDisabled={!hasAuthorityWithEmail}
      />

      {/* Email Confirmation Prompt */}
      <EmailPrompt
        ref={emailPromptRef}
        onConfirm={handleEmailConfirm}
        onDismiss={handleEmailDismiss}
      />
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.lg,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing['2xl'],
    gap: Spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing['2xl'],
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  authorityList: {
    gap: Spacing.sm,
  },
  sortToggle: {
    alignSelf: 'flex-end',
  },
  commentLoader: {
    paddingVertical: Spacing.lg,
  },
  loadMore: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    gap: Spacing.md,
  },
  ctaButton: {
    flex: 1,
  },
  bottomSpacer: {
    height: 80,
  },
  backButtonError: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  // Skeleton
  skeleton: {
    flex: 1,
  },
  skeletonPhoto: {
    height: 250,
    width: '100%',
  },
  skeletonContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  skeletonLine: {
    height: 16,
    borderRadius: BorderRadius.xs,
    borderCurve: 'continuous',
  },
  skeletonBlock: {
    height: 80,
    borderRadius: BorderRadius.sm,
    borderCurve: 'continuous',
    borderWidth: 1,
    marginTop: Spacing.md,
  },
});
