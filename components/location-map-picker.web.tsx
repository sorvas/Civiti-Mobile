import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Localization } from '@/constants/localization';
import { Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type LocationMapPickerProps = {
  latitude: number | null;
  longitude: number | null;
  onLocationSelect: (lat: number, lng: number) => void;
  initialRegion?: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };
};

export function LocationMapPicker(_props: LocationMapPickerProps) {
  const scheme = useColorScheme() ?? 'light';

  return (
    <View style={[styles.container, { backgroundColor: Colors[scheme].surface }]}>
      <ThemedText type="body" style={{ color: Colors[scheme].textSecondary }}>
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
    padding: Spacing.lg,
  },
});
