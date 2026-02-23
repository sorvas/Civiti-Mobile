import { ErrorBoundary, useRouter } from 'expo-router';
import { useRef, useMemo, useState, useCallback } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { FilterSheet } from '@/components/filter-sheet';
import { IssueCard } from '@/components/issue-card';
import { IssueCardSkeleton } from '@/components/issue-card-skeleton';
import { ThemedText } from '@/components/themed-text';
import type { BottomSheetMethods } from '@/components/ui/bottom-sheet';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Localization } from '@/constants/localization';
import { Spacing } from '@/constants/spacing';
import { BrandColors, Fonts } from '@/constants/theme';
import { useIssues } from '@/hooks/use-issues';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { IssueFilters, IssueListResponse } from '@/types/issues';

export { ErrorBoundary };

// ─── ListHeader ─────────────────────────────────────────────────

type ListHeaderProps = {
  onFilterPress: () => void;
  activeFilterCount: number;
};

function ListHeader({ onFilterPress, activeFilterCount }: ListHeaderProps) {
  const iconColor = useThemeColor({}, 'text');

  return (
    <View style={styles.header}>
      <ThemedText type="h1">{Localization.tabs.issues}</ThemedText>
      <Pressable
        onPress={onFilterPress}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={
          activeFilterCount > 0
            ? `${Localization.filter.title}, ${activeFilterCount} ${Localization.filter.activeFilters}`
            : Localization.filter.title
        }
      >
        <IconSymbol name="line.3.horizontal.decrease.circle" size={26} color={iconColor} />
        {activeFilterCount > 0 && (
          <View
            style={styles.badge}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <ThemedText style={styles.badgeText}>
              {activeFilterCount}
            </ThemedText>
          </View>
        )}
      </Pressable>
    </View>
  );
}

// ─── Helpers ────────────────────────────────────────────────────

const keyExtractor = (item: IssueListResponse) => item.id;

// ─── Screen ─────────────────────────────────────────────────────

export default function IssuesScreen() {
  const router = useRouter();
  const accent = useThemeColor({}, 'accent');
  const background = useThemeColor({}, 'background');

  const [filters, setFilters] = useState<IssueFilters>({});
  const filterSheetRef = useRef<BottomSheetMethods>(null);

  const {
    issues,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useIssues(filters);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.urgency) count++;
    if (filters.status) count++;
    if (filters.sortBy && (filters.sortBy !== 'createdAt' || filters.sortDescending === false)) {
      count++;
    }
    return count;
  }, [filters]);

  const handleFilterPress = useCallback(() => {
    filterSheetRef.current?.expand();
  }, []);

  const renderHeader = useCallback(
    () => <ListHeader onFilterPress={handleFilterPress} activeFilterCount={activeFilterCount} />,
    [handleFilterPress, activeFilterCount],
  );

  const handlePress = useCallback(
    (id: string) => {
      router.push({ pathname: '/issues/[id]', params: { id } });
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: IssueListResponse }) => (
      <IssueCard issue={item} onPress={() => handlePress(item.id)} />
    ),
    [handlePress],
  );

  const renderFooter = useCallback(
    () =>
      isFetchingNextPage ? (
        <ActivityIndicator style={styles.footer} color={accent} />
      ) : null,
    [isFetchingNextPage, accent],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const content = isLoading ? (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]} edges={['top']}>
      {renderHeader()}
      <IssueCardSkeleton />
      <IssueCardSkeleton />
      <IssueCardSkeleton />
    </SafeAreaView>
  ) : isError ? (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]} edges={['top']}>
      {renderHeader()}
      <ErrorState onRetry={refetch} />
    </SafeAreaView>
  ) : issues.length === 0 ? (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]} edges={['top']}>
      {renderHeader()}
      <EmptyState message={Localization.states.emptyIssues} />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]} edges={['top']}>
      <FlatList
        data={issues}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={accent} />
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );

  return (
    <>
      {content}
      <FilterSheet
        sheetRef={filterSheetRef}
        appliedFilters={filters}
        onApply={setFilters}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: BrandColors.orangeWeb,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  badgeText: {
    color: BrandColors.oxfordBlue,
    fontSize: 10,
    lineHeight: 14,
    fontFamily: Fonts.bold,
  },
  footer: {
    paddingVertical: Spacing.xl,
  },
  listContent: {
    paddingBottom: Spacing['3xl'],
  },
});
