import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, {
  Marker,
  type MarkerDragStartEndEvent,
  PROVIDER_DEFAULT,
  type MapPressEvent,
  type Region,
} from 'react-native-maps';

type LocationMapPickerProps = {
  latitude: number | null;
  longitude: number | null;
  onLocationSelect: (lat: number, lng: number) => void;
  initialRegion?: Region;
};

const BUCHAREST_CENTER: Region = {
  latitude: 44.4268,
  longitude: 26.1025,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export function LocationMapPicker({
  latitude,
  longitude,
  onLocationSelect,
  initialRegion,
}: LocationMapPickerProps) {
  const mapRef = useRef<MapView>(null);

  // Animate to new coordinates when they change (e.g. from search)
  const prevCoords = useRef<{ lat: number; lng: number } | null>(null);
  useEffect(() => {
    if (latitude == null || longitude == null) return;
    const prev = prevCoords.current;
    // Skip if coordinates haven't actually changed (avoids animating on initial mount)
    if (prev && prev.lat === latitude && prev.lng === longitude) return;
    prevCoords.current = { lat: latitude, lng: longitude };

    // Only animate if this isn't the initial render with existing wizard values
    if (prev != null) {
      mapRef.current?.animateToRegion(
        { latitude, longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 },
        500,
      );
    }
  }, [latitude, longitude]);

  const handleMapPress = useCallback(
    (e: MapPressEvent) => {
      const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
      onLocationSelect(lat, lng);
    },
    [onLocationSelect],
  );

  const handleDragEnd = useCallback(
    (e: MarkerDragStartEndEvent) => {
      const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
      onLocationSelect(lat, lng);
    },
    [onLocationSelect],
  );

  const region =
    latitude != null && longitude != null
      ? { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }
      : initialRegion ?? BUCHAREST_CENTER;

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      provider={PROVIDER_DEFAULT}
      initialRegion={region}
      onPress={handleMapPress}
    >
      {latitude != null && longitude != null ? (
        <Marker
          coordinate={{ latitude, longitude }}
          draggable
          onDragEnd={handleDragEnd}
          tracksViewChanges={false}
        />
      ) : null}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
