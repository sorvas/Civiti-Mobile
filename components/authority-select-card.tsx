import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { BrandColors, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AuthoritySelectCardProps = {
  name: string;
  email: string | null;
  isSelected: boolean;
  onToggle: () => void;
};

export function AuthoritySelectCard({
  name,
  email,
  isSelected,
  onToggle,
}: AuthoritySelectCardProps) {
  const scheme = useColorScheme() ?? 'light';

  return (
    <Pressable
      onPress={onToggle}
      style={[
        styles.card,
        {
          borderColor: isSelected ? Colors[scheme].tint : Colors[scheme].border,
          backgroundColor: isSelected
            ? BrandColors.orangeWeb20
            : Colors[scheme].surface,
        },
      ]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isSelected }}
      accessibilityLabel={name}
    >
      <View style={styles.content}>
        <ThemedText type="bodyBold" numberOfLines={1}>
          {name}
        </ThemedText>
        {email ? (
          <ThemedText
            type="caption"
            style={{ color: Colors[scheme].textSecondary }}
            numberOfLines={1}
          >
            {email}
          </ThemedText>
        ) : null}
      </View>
      <IconSymbol
        name={isSelected ? 'checkmark.circle.fill' : 'circle'}
        size={24}
        color={isSelected ? Colors[scheme].tint : Colors[scheme].tabIconDefault}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderCurve: 'continuous',
    borderWidth: 1,
    minHeight: 56,
    gap: Spacing.md,
  },
  content: {
    flex: 1,
    gap: Spacing.xxs,
  },
});
