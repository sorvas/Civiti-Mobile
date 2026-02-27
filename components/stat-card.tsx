import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Shadows, Spacing } from '@/constants/spacing';
import { useThemeColor } from '@/hooks/use-theme-color';

type IconSymbolName = Parameters<typeof IconSymbol>[0]['name'];

type StatCardProps = {
  icon: IconSymbolName;
  value: number;
  label: string;
};

export function StatCard({ icon, value, label }: StatCardProps) {
  const surfaceColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const secondaryColor = useThemeColor({}, 'textSecondary');

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: surfaceColor,
          borderColor,
        },
      ]}
    >
      <IconSymbol name={icon} size={24} color={secondaryColor} />
      <ThemedText type="h2" style={styles.value}>
        {value}
      </ThemedText>
      <ThemedText type="caption" style={styles.label}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderCurve: 'continuous',
    borderWidth: 1,
    gap: Spacing.xs,
    ...Shadows.sm,
  },
  value: {
    fontVariant: ['tabular-nums'],
  },
  label: {
    textAlign: 'center',
  },
});
