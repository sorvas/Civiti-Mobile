import { Pressable, StyleSheet, View } from 'react-native';

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

/** Web fallback — react-native-maps is native-only */
export function LocationPreview({
  latitude,
  longitude,
  address,
}: LocationPreviewProps) {
  const border = useThemeColor({}, 'border');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const accent = useThemeColor({}, 'accent');

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <View style={[styles.container, { borderColor: border, backgroundColor: border }]}>
      <View style={styles.placeholder}>
        <IconSymbol name="mappin.circle.fill" size={32} color={textSecondary} />
        {address ? (
          <ThemedText type="body" style={{ color: textSecondary, textAlign: 'center' }}>
            {address}
          </ThemedText>
        ) : null}

        <Pressable
          onPress={() => {
            window.open(mapsUrl, '_blank');
          }}
          accessibilityRole="link"
        >
          <ThemedText type="link" style={{ color: accent }}>
            {Localization.detail.openInMaps}
          </ThemedText>
        </Pressable>
      </View>
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
  placeholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
});
