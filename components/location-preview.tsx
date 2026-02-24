import { useCallback } from 'react';
import { Linking, Platform, Pressable, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Localization } from '@/constants/localization';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { useThemeColor } from '@/hooks/use-theme-color';

type LocationPreviewProps = {
  latitude: number;
  longitude: number;
  address: string | null;
};

export function LocationPreview({
  latitude,
  longitude,
  address,
}: LocationPreviewProps) {
  const border = useThemeColor({}, 'border');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const accent = useThemeColor({}, 'accent');

  const handleOpenMaps = useCallback(() => {
    const label = encodeURIComponent(address ?? 'Issue location');
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      default: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
    });
    Linking.openURL(url);
  }, [latitude, longitude, address]);

  return (
    <View style={[styles.container, { borderColor: border }]}>
      <Pressable onPress={handleOpenMaps} style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          pointerEvents="none"
        >
          <Marker
            coordinate={{ latitude, longitude }}
            tracksViewChanges={false}
          />
        </MapView>
      </Pressable>

      {address ? (
        <View style={styles.addressRow}>
          <IconSymbol name="mappin.circle.fill" size={16} color={textSecondary} />
          <ThemedText type="caption" style={{ color: textSecondary, flex: 1 }} numberOfLines={2}>
            {address}
          </ThemedText>
        </View>
      ) : null}

      <Pressable
        onPress={handleOpenMaps}
        style={styles.openLink}
        accessibilityRole="link"
      >
        <ThemedText type="link" style={{ color: accent }}>
          {Localization.detail.openInMaps}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.sm,
    borderCurve: 'continuous',
    borderWidth: 1,
    overflow: 'hidden',
  },
  mapWrapper: {
    height: 200,
  },
  map: {
    flex: 1,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  openLink: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
});
