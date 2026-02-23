import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/spacing';

export default function IssueDetailScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1">Detalii problemă</ThemedText>
      <ThemedText type="caption">Placeholder — S09 will build the detail screen.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
});
