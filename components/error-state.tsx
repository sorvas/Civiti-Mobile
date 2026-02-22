import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Localization } from '@/constants/localization';
import { Spacing } from '@/constants/spacing';
import { useThemeColor } from '@/hooks/use-theme-color';

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const errorColor = useThemeColor({}, 'error');

  return (
    <View style={styles.container}>
      <IconSymbol name="exclamationmark.triangle.fill" size={48} color={errorColor} />
      <ThemedText type="body" style={styles.message}>
        {message ?? Localization.errors.generic}
      </ThemedText>
      {onRetry ? (
        <Button variant="secondary" title={Localization.actions.retry} onPress={onRetry} size="small" />
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
