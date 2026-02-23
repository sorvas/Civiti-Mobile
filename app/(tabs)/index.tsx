import { ErrorBoundary, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { IssueCard } from '@/components/issue-card';
import { IssueCardSkeleton } from '@/components/issue-card-skeleton';
import { ThemedText } from '@/components/themed-text';
import { Localization } from '@/constants/localization';
import { Spacing } from '@/constants/spacing';
import { useIssues } from '@/hooks/use-issues';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { IssueListResponse } from '@/types/issues';

export { ErrorBoundary };

function ListHeader() {
  return (
    <View style={styles.header}>
      <ThemedText type="h1">{Localization.tabs.issues}</ThemedText>
    </View>
  );
}

export default function IssuesScreen() {
  const router = useRouter();
  const accent = useThemeColor({}, 'accent');
  const background = useThemeColor({}, 'background');

  const {
    issues,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useIssues();

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: background }]} edges={['top']}>
        <ListHeader />
        <IssueCardSkeleton />
        <IssueCardSkeleton />
        <IssueCardSkeleton />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: background }]} edges={['top']}>
        <ListHeader />
        <ErrorState onRetry={refetch} />
      </SafeAreaView>
    );
  }

  if (issues.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: background }]} edges={['top']}>
        <ListHeader />
        <EmptyState message={Localization.states.emptyIssues} />
      </SafeAreaView>
    );
  }

  const handlePress = (id: string) => {
    router.push({ pathname: '/issues/[id]', params: { id } });
  };

  const renderItem = ({ item }: { item: IssueListResponse }) => (
    <IssueCard issue={item} onPress={() => handlePress(item.id)} />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]} edges={['top']}>
      <FlatList
        data={issues}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={styles.footer} color={accent} />
          ) : null
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={accent} />
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  footer: {
    paddingVertical: Spacing.xl,
  },
  listContent: {
    paddingBottom: Spacing['3xl'],
  },
});
