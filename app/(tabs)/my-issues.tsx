import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Localization } from '@/constants/localization';
import { Spacing } from '@/constants/spacing';

export default function MyIssuesScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1">{Localization.tabs.myIssues}</ThemedText>
      <ThemedText type="caption">{Localization.placeholderCaptions.myIssues}</ThemedText>
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
