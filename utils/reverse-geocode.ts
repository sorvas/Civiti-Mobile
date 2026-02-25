import * as Location from 'expo-location';

const BUCHAREST_SECTORS = [
  'Sector 1',
  'Sector 2',
  'Sector 3',
  'Sector 4',
  'Sector 5',
  'Sector 6',
] as const;

type ReverseGeocodeResult = {
  address: string;
  district: string | null;
};

/**
 * Reverse-geocode coordinates into a formatted address and district.
 * Uses the native OS geocoder (no API key needed).
 */
export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<ReverseGeocodeResult> {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
    if (!results.length) {
      return { address: '', district: null };
    }

    const result = results[0];
    const parts: string[] = [];

    if (result.street) {
      parts.push(
        result.streetNumber ? `${result.street} ${result.streetNumber}` : result.street,
      );
    }
    if (result.city) {
      parts.push(result.city);
    }

    const address = parts.join(', ');
    const district = parseDistrict(result);

    return { address, district };
  } catch (error) {
    console.warn('[reverseGeocode] Failed:', error);
    return { address: '', district: null };
  }
}

function parseDistrict(result: Location.LocationGeocodedAddress): string | null {
  // Check subregion first (most common for Bucharest sectors)
  const candidate = result.subregion ?? result.district ?? null;
  if (!candidate) return null;

  // Match against known Bucharest sectors
  const match = BUCHAREST_SECTORS.find(
    (sector) => candidate.toLowerCase().includes(sector.toLowerCase()),
  );
  if (match) return match;

  // If the raw value looks like "Sectorul X", normalize it
  const sectorMatch = candidate.match(/sector(?:ul)?\s*(\d)/i);
  if (sectorMatch) {
    return `Sector ${sectorMatch[1]}`;
  }

  return candidate;
}
