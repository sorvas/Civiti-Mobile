import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { IssueCategory } from '@/constants/enums';
import { Localization } from '@/constants/localization';
import { CategoryColors } from '@/constants/theme';
import { BorderRadius, Spacing } from '@/constants/spacing';

type CategoryBadgeProps = {
  category: IssueCategory;
};

type IconSymbolName = Parameters<typeof IconSymbol>[0]['name'];

const CATEGORY_ICONS: Record<IssueCategory, IconSymbolName> = {
  Infrastructure: 'wrench.fill',
  Environment: 'leaf.fill',
  Transportation: 'car.fill',
  PublicServices: 'building.2.fill',
  Safety: 'shield.fill',
  Other: 'ellipsis.circle.fill',
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const color = CategoryColors[category];

  return (
    <View style={[styles.badge, { backgroundColor: `${color}1A` }]}>
      <IconSymbol name={CATEGORY_ICONS[category]} size={14} color={color} />
      <ThemedText type="badge" style={{ color }}>
        {Localization.category[category]}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xxs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.xs,
    alignSelf: 'flex-start',
  },
});
