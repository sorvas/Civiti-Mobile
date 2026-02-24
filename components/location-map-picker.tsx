import { useCallback, useRef } from 'react';
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
