import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedBottomSheet, type BottomSheetMethods } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { ChipSelector } from '@/components/ui/chip-selector';
import { RadioGroup } from '@/components/ui/radio-group';
import { SkeletonBlock } from '@/components/loading-skeleton';
import { ThemedText } from '@/components/themed-text';
import { IssueCategory, UrgencyLevel } from '@/constants/enums';
import { Localization } from '@/constants/localization';
import { Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { useCategories } from '@/hooks/use-categories';
import type { ApiIssueStatus } from '@/types/enums';
import type { IssueFilters } from '@/types/issues';

// ─── Static options ─────────────────────────────────────────────

const URGENCY_OPTIONS = Object.values(UrgencyLevel).map((value) => ({
  value,
  label: Localization.urgency[value],
}));

const STATUS_OPTIONS: { value: ApiIssueStatus; label: string }[] = [
  { value: 'Active', label: Localization.statusSimple.Active },
  { value: 'Resolved', label: Localization.statusSimple.Resolved },
];

const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: Localization.sort.newest },
  { value: 'createdAt_asc', label: Localization.sort.oldest },
  { value: 'communityVotes_desc', label: Localization.sort.mostSupported },
  { value: 'urgency_desc', label: Localization.sort.mostUrgent },
];

const DEFAULT_SORT_KEY = 'createdAt_desc';

// ─── Helpers ────────────────────────────────────────────────────

function encodeSortKey(sortBy?: string, sortDescending?: boolean): string {
  if (!sortBy) return DEFAULT_SORT_KEY;
  return `${sortBy}_${sortDescending === false ? 'asc' : 'desc'}`;
}

function decodeSortKey(key: string): { sortBy: string; sortDescending: boolean } {
  const lastUnderscore = key.lastIndexOf('_');
  return {
    sortBy: key.slice(0, lastUnderscore),
    sortDescending: key.slice(lastUnderscore + 1) !== 'asc',
  };
}

// ─── Draft state ────────────────────────────────────────────────

type FilterDraft = {
  category?: IssueCategory;
  urgency?: UrgencyLevel;
  status?: ApiIssueStatus;
  sortKey: string;
};

function filtersToDraft(filters: IssueFilters): FilterDraft {
  return {
    category: filters.category,
    urgency: filters.urgency,
    status: filters.status,
    sortKey: encodeSortKey(filters.sortBy, filters.sortDescending),
  };
}

// ─── Component ──────────────────────────────────────────────────

type FilterSheetProps = {
  sheetRef: React.RefObject<BottomSheetMethods | null>;
  appliedFilters: IssueFilters;
  onApply: (filters: IssueFilters) => void;
};

export function FilterSheet({ sheetRef, appliedFilters, onApply }: FilterSheetProps) {
  const [draft, setDraft] = useState<FilterDraft>(() => filtersToDraft(appliedFilters));
  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useCategories();

  // Re-sync draft when applied filters change externally
  useEffect(() => {
    setDraft(filtersToDraft(appliedFilters));
  }, [appliedFilters]);

  const categoryOptions = useMemo(
    () =>
      (categories ?? [])
        .filter((c) => c.value != null)
        .map((c) => ({
          value: c.value!,
          label: Localization.category[c.value as IssueCategory] ?? c.label ?? c.value!,
        })),
    [categories],
  );

  const handleCategoryChange = useCallback((values: string[]) => {
    setDraft((d) => {
      const newValue = values.find((v) => v !== d.category);
      return { ...d, category: newValue as IssueCategory | undefined };
    });
  }, []);

  const handleUrgencyChange = useCallback((values: string[]) => {
    setDraft((d) => {
      const newValue = values.find((v) => v !== d.urgency);
      return { ...d, urgency: newValue as UrgencyLevel | undefined };
    });
  }, []);

  const handleStatusChange = useCallback((values: string[]) => {
    setDraft((d) => {
      const newValue = values.find((v) => v !== d.status);
      return { ...d, status: newValue as ApiIssueStatus | undefined };
    });
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setDraft((d) => ({ ...d, sortKey: value }));
  }, []);

  const handleApply = useCallback(() => {
    const { sortBy, sortDescending } = decodeSortKey(draft.sortKey);
    const filters: IssueFilters = {};
    if (draft.category) filters.category = draft.category;
    if (draft.urgency) filters.urgency = draft.urgency;
    if (draft.status) filters.status = draft.status;
    if (sortBy !== 'createdAt' || !sortDescending) {
      filters.sortBy = sortBy;
      filters.sortDescending = sortDescending;
    }
    onApply(filters);
    sheetRef.current?.close();
  }, [draft, onApply, sheetRef]);

  const handleReset = useCallback(() => {
    setDraft({ sortKey: DEFAULT_SORT_KEY });
    onApply({});
    sheetRef.current?.close();
  }, [onApply, sheetRef]);

  return (
    <ThemedBottomSheet ref={sheetRef}>
      <BottomSheetScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <ThemedText type="h2">{Localization.filter.title}</ThemedText>

        {/* Category */}
        <View style={styles.section}>
          <ThemedText type="label">{Localization.filter.categoryLabel}</ThemedText>
          {categoriesLoading ? (
            <SkeletonBlock height={36} />
          ) : categoriesError ? (
            <ThemedText
              type="caption"
              lightColor={Colors.light.textSecondary}
              darkColor={Colors.dark.textSecondary}
            >
              {Localization.errors.generic}
            </ThemedText>
          ) : (
            <View style={styles.chipEdgeBleed}>
              <ChipSelector
                options={categoryOptions}
                selectedValues={draft.category ? [draft.category] : []}
                onSelectionChange={handleCategoryChange}
              />
            </View>
          )}
        </View>

        {/* Urgency */}
        <View style={styles.section}>
          <ThemedText type="label">{Localization.filter.urgencyLabel}</ThemedText>
          <View style={styles.chipEdgeBleed}>
            <ChipSelector
              options={URGENCY_OPTIONS}
              selectedValues={draft.urgency ? [draft.urgency] : []}
              onSelectionChange={handleUrgencyChange}
            />
          </View>
        </View>

        {/* Status */}
        <View style={styles.section}>
          <ThemedText type="label">{Localization.filter.statusLabel}</ThemedText>
          <View style={styles.chipEdgeBleed}>
            <ChipSelector
              options={STATUS_OPTIONS}
              selectedValues={draft.status ? [draft.status] : []}
              onSelectionChange={handleStatusChange}
            />
          </View>
        </View>

        {/* Sort */}
        <View style={styles.section}>
          <ThemedText type="label">{Localization.filter.sortLabel}</ThemedText>
          <RadioGroup
            options={SORT_OPTIONS}
            selectedValue={draft.sortKey}
            onValueChange={handleSortChange}
          />
        </View>

        {/* CTAs */}
        <View style={styles.ctas}>
          <Button variant="primary" title={Localization.filter.apply} onPress={handleApply} />
          <Button variant="ghost" title={Localization.filter.reset} onPress={handleReset} />
        </View>
      </BottomSheetScrollView>
    </ThemedBottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing['4xl'],
    gap: Spacing.xl,
  },
  section: {
    gap: Spacing.sm,
  },
  chipEdgeBleed: {
    marginHorizontal: -Spacing.xl,
  },
  ctas: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
});
