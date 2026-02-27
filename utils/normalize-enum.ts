/**
 * Converts a camelCase enum string from the .NET API (JsonNamingPolicy.CamelCase)
 * back to PascalCase for frontend enum matching.
 *
 * Example: "infrastructure" → "Infrastructure", "publicServices" → "PublicServices"
 */
export function toPascalCase(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Converts a PascalCase enum string to camelCase for sending to the .NET API.
 *
 * Example: "Infrastructure" → "infrastructure", "PublicServices" → "publicServices"
 */
export function toCamelCase(value: string): string {
  if (!value) return value;
  return value.charAt(0).toLowerCase() + value.slice(1);
}

/**
 * Normalises an enum value from the API to PascalCase, typed as T.
 * Returns the value as-is if already PascalCase (idempotent).
 */
export function normalizeEnum<T extends string>(value: T): T {
  return toPascalCase(value) as T;
}

/**
 * Converts a PascalCase enum value to camelCase for API requests, typed as T.
 */
export function denormalizeEnum<T extends string>(value: T): T {
  return toCamelCase(value) as T;
}
