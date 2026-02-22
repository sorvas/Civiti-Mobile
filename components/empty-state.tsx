import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing } from '@/constants/spacing';
import { useThemeColor } from '@/hooks/use-theme-color';

type EmptyStateProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  const iconColor = useThemeColor({}, 'textSecondary');

  return (
    <View style={styles.container}>
      <IconSymbol name="doc.text.fill" size={48} color={iconColor} />
      <ThemedText type="body" style={styles.message}>
        {message}
      </ThemedText>
      {actionLabel && onAction ? (
        <Button variant="secondary" title={actionLabel} onPress={onAction} size="small" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['3xl'],
    gap: Spacing.lg,
  },
  message: {
    textAlign: 'center',
  },
});
