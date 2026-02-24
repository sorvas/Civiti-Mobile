import { ErrorState } from '@/components/error-state';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { WizardProgress } from '@/components/wizard-progress';
import type { IssueCategory } from '@/constants/enums';
import { Localization } from '@/constants/localization';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { CategoryColors, Colors } from '@/constants/theme';
import { useCategories } from '@/hooks/use-categories';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWizard } from '@/store/wizard-context';
import { hexToRgba } from '@/utils/colors';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IconSymbolName = Parameters<typeof IconSymbol>[0]['name'];

const CATEGORY_ICONS: Record<IssueCategory, IconSymbolName> = {
  Infrastructure: 'wrench.fill',
  Environment: 'leaf.fill',
  Transportation: 'car.fill',
  PublicServices: 'building.2.fill',
  Safety: 'shield.fill',
  Other: 'ellipsis.circle.fill',
};

const GRID_COLUMNS = 2;
const ICON_CIRCLE_SIZE = 56;

function CategoryCard({
  category,
  size,
  onPress,
}: {
  category: IssueCategory;
  size: number;
  onPress: () => void;
}) {
  const scheme = useColorScheme() ?? 'light';
  const color = CategoryColors[category] ?? CategoryColors.Other;
  const label = Localization.category[category] ?? category;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          width: size,
          backgroundColor: pressed
            ? hexToRgba(color, 0.15)
            : Colors[scheme].surface,
          borderColor: Colors[scheme].border,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={[styles.iconCircle, { backgroundColor: hexToRgba(color, 0.12) }]}>
        <IconSymbol name={CATEGORY_ICONS[category]} size={28} color={color} />
      </View>
      <ThemedText type="bodyBold" style={styles.cardLabel}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export default function CreateStep1() {
  const scheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();
  const { setCategory } = useWizard();
  const { data: categories, isLoading, isError, refetch } = useCategories();
  const { width: windowWidth } = useWindowDimensions();

  const gridPadding = Spacing.lg * 2;
  const gap = Spacing.sm;
  const cardSize = (windowWidth - gridPadding - gap * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

  const handleSelect = useCallback(
    (value: IssueCategory) => {
      setCategory(value);
      router.push('/create/photos');
    },
    [setCategory],
  );

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top + Spacing.md }]}>
      <WizardProgress currentStep={1} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="h2">{Localization.wizard.step1Title}</ThemedText>
        <ThemedText type="caption" style={{ color: Colors[scheme].textSecondary }}>
          {Localization.wizard.step1Subtitle}
        </ThemedText>

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors[scheme].tint} />
          </View>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <View style={styles.grid}>
            {(categories ?? [])
              .filter((cat) => cat.value != null)
              .map((cat) => {
                const value = cat.value as IssueCategory;
                return (
                  <CategoryCard
                    key={value}
                    category={value}
                    size={cardSize}
                    onPress={() => handleSelect(value)}
                  />
                );
              })}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing['4xl'],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['4xl'],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing['2xl'],
    borderRadius: BorderRadius.md,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  iconCircle: {
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    textAlign: 'center',
  },
});
