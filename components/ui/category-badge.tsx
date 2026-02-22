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

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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
    <View style={[styles.badge, { backgroundColor: hexToRgba(color, 0.1) }]}>
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
