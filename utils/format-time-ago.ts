import { Localization } from '@/constants/localization';

/**
 * Formats an ISO date string as a Romanian relative-time string.
 *
 * Examples: "acum", "5 min", "3 h", "2 z", "1 săpt", "4 luni"
 *
 * @param isoDate — ISO 8601 date string (e.g. "2025-06-10T14:30:00Z")
 * @returns A compact Romanian relative-time string
 */
export function formatTimeAgo(isoDate: string): string {
  const t = Localization.timeAgo;
  const parsed = Date.parse(isoDate);

  if (Number.isNaN(parsed)) return t.now;

  const diffMs = Date.now() - parsed;
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) return t.now;
  if (minutes < 60) return `${minutes} ${t.minutes}`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${t.hours}`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ${t.days}`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} ${t.weeks}`;

  const months = Math.floor(days / 30);
  return `${months} ${t.months}`;
}
