import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Localization } from '@/constants/localization';
import { Spacing } from '@/constants/spacing';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { IssueListResponse } from '@/types/issues';

type IssueMapViewProps = {
  issues: IssueListResponse[];
  onIssuePress: (id: string) => void;
};

/** Web fallback — react-native-maps is native-only */
export function IssueMapView(_props: IssueMapViewProps) {
  const textSecondary = useThemeColor({}, 'textSecondary');

  return (
    <View style={styles.container}>
      <ThemedText type="caption" style={{ color: textSecondary }}>
        {Localization.map.webUnavailable}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
