import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Location from 'expo-location';

import { LocationMapPicker } from '@/components/location-map-picker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Localization } from '@/constants/localization';
import { BorderRadius, Shadows, Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWizard } from '@/store/wizard-context';
import { reverseGeocode } from '@/utils/reverse-geocode';

const SEARCH_DEBOUNCE_MS = 500;

export default function LocationPickerScreen() {
  const scheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();
  const wizard = useWizard();

  const [selectedLat, setSelectedLat] = useState<number | null>(wizard.latitude);
  const [selectedLng, setSelectedLng] = useState<number | null>(wizard.longitude);
  const [resolvedAddress, setResolvedAddress] = useState(wizard.address);
  const [resolvedDistrict, setResolvedDistrict] = useState(wizard.district);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
    setSearchError(null);
  }, []);

  // Reverse geocode when coordinates change
  useEffect(() => {
    if (selectedLat == null || selectedLng == null) return;

    let cancelled = false;
    setIsGeocoding(true);

    reverseGeocode(selectedLat, selectedLng)
      .then((result) => {
        if (cancelled) return;
        setResolvedAddress(result.address);
        setResolvedDistrict(result.district);
      })
      .catch((error) => {
        if (cancelled) return;
        console.warn('[LocationPicker] Reverse geocode failed:', error);
        setResolvedAddress('');
        setResolvedDistrict(null);
      })
      .finally(() => {
        if (!cancelled) setIsGeocoding(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedLat, selectedLng]);

  // Debounced forward geocode from search input
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    setSearchError(null);

    if (searchTimer.current) clearTimeout(searchTimer.current);

    if (text.trim().length < 3) {
      setIsSearching(false);
      return;
    }

    searchTimer.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await Location.geocodeAsync(text.trim());
        if (results.length > 0) {
          const { latitude: lat, longitude: lng } = results[0];
          handleLocationSelect(lat, lng);
        } else {
          setSearchError(Localization.wizard.searchNoResults);
        }
      } catch (err) {
        console.warn('[LocationPicker] Forward geocode failed:', err);
        setSearchError(Localization.wizard.searchNoResults);
      } finally {
        setIsSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);
  }, [handleLocationSelect]);

  // Clean up search timer
  useEffect(() => {
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedLat == null || selectedLng == null) return;
    const addr = resolvedAddress || '';
    wizard.setLocation(selectedLat, selectedLng, resolvedDistrict, addr);
    router.back();
  }, [selectedLat, selectedLng, resolvedDistrict, resolvedAddress, wizard]);

  const hasSelection = selectedLat != null && selectedLng != null;

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: Colors[scheme].border }]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={Localization.actions.close}
          style={styles.closeButton}
        >
          <IconSymbol name="xmark" size={20} color={Colors[scheme].text} />
        </Pressable>
        <ThemedText type="h3">{Localization.wizard.locationPickerTitle}</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <LocationMapPicker
          latitude={selectedLat}
          longitude={selectedLng}
          onLocationSelect={handleLocationSelect}
        />

        {/* Floating search bar */}
        <View style={[styles.searchContainer, { top: Spacing.md }]}>
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: Colors[scheme].surface,
                borderColor: Colors[scheme].border,
              },
            ]}
          >
            <IconSymbol name="magnifyingglass" size={18} color={Colors[scheme].textSecondary} />
            <RNTextInput
              style={[
                styles.searchInput,
                { color: Colors[scheme].text, fontFamily: Fonts.regular },
              ]}
              placeholder={Localization.wizard.searchAddressPlaceholder}
              placeholderTextColor={Colors[scheme].textSecondary}
              value={searchQuery}
              onChangeText={handleSearchChange}
              returnKeyType="search"
              autoCorrect={false}
            />
            {isSearching ? (
              <ActivityIndicator size="small" color={Colors[scheme].tint} />
            ) : null}
          </View>
          {searchError ? (
            <View style={[styles.searchErrorBubble, { backgroundColor: Colors[scheme].surface }]}>
              <ThemedText type="caption" style={{ color: Colors[scheme].error }}>
                {searchError}
              </ThemedText>
            </View>
          ) : null}
        </View>

        {!hasSelection ? (
          <View style={[styles.hint, { backgroundColor: Colors[scheme].surface }]}>
            <ThemedText type="caption" style={{ color: Colors[scheme].textSecondary }}>
              {Localization.wizard.tapToPlacePin}
            </ThemedText>
          </View>
        ) : null}
      </View>

      {/* Bottom area */}
      <View
        style={[
          styles.bottomArea,
          {
            backgroundColor: Colors[scheme].surface,
            borderTopColor: Colors[scheme].border,
            paddingBottom: Math.max(insets.bottom, Spacing.lg),
          },
        ]}
      >
        {hasSelection ? (
          <View style={styles.addressPreview}>
            {isGeocoding ? (
              <View style={styles.geocodingRow}>
                <ActivityIndicator size="small" color={Colors[scheme].tint} />
                <ThemedText type="caption" style={{ color: Colors[scheme].textSecondary }}>
                  {Localization.wizard.geocoding}
                </ThemedText>
              </View>
            ) : (
              <>
                {resolvedAddress ? (
                  <ThemedText type="body" numberOfLines={2}>
                    {resolvedAddress}
                  </ThemedText>
                ) : null}
                {resolvedDistrict ? (
                  <View
                    style={[
                      styles.districtBadge,
                      { backgroundColor: Colors[scheme].infoMuted },
                    ]}
                  >
                    <ThemedText type="caption" style={{ color: Colors[scheme].info }}>
                      {resolvedDistrict}
                    </ThemedText>
                  </View>
                ) : null}
              </>
            )}
          </View>
        ) : null}

        <Button
          title={Localization.wizard.confirmLocation}
          onPress={handleConfirm}
          disabled={!hasSelection || isGeocoding}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  mapContainer: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 1,
    gap: Spacing.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    height: 44,
    borderRadius: BorderRadius.sm,
    borderCurve: 'continuous',
    borderWidth: 1,
    ...Shadows.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  searchErrorBubble: {
    alignSelf: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderCurve: 'continuous',
  },
  hint: {
    position: 'absolute',
    bottom: Spacing.lg,
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderCurve: 'continuous',
  },
  bottomArea: {
    padding: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
  },
  addressPreview: {
    gap: Spacing.sm,
  },
  geocodingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  districtBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.xs,
    borderCurve: 'continuous',
  },
});
