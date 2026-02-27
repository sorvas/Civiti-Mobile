import { denormalizeEnum, normalizeEnum } from '@/utils/normalize-enum';
import type { PagedResult } from '@/types/api';
import type { IssueDetailResponse, IssueListResponse } from '@/types/issues';

/** Normalize camelCase enum fields on a single list-level issue. */
export function normalizeIssueListItem(item: IssueListResponse): IssueListResponse {
  return {
    ...item,
    category: normalizeEnum(item.category),
    urgency: normalizeEnum(item.urgency),
    status: normalizeEnum(item.status),
  };
}

/** Normalize camelCase enum fields on a full issue detail response. */
export function normalizeIssueDetail(issue: IssueDetailResponse): IssueDetailResponse {
  return {
    ...issue,
    category: normalizeEnum(issue.category),
    urgency: normalizeEnum(issue.urgency),
    status: normalizeEnum(issue.status),
  };
}

/** Normalize all items in a paged issue list response. */
export function normalizePagedIssues(
  page: PagedResult<IssueListResponse>,
): PagedResult<IssueListResponse> {
  return {
    ...page,
    items: page.items?.map(normalizeIssueListItem) ?? null,
  };
}

// ─── Outgoing: PascalCase → camelCase for API requests ──────────

const ENUM_PARAM_KEYS = new Set(['status', 'category', 'urgency', 'sortBy']);

type QueryParams = Record<string, string | number | boolean | undefined | null>;

/** Convert PascalCase enum values in query params to camelCase for the API. */
export function denormalizeParams(
  params?: QueryParams,
): QueryParams | undefined {
  if (!params) return undefined;
  const result: QueryParams = {};
  for (const [key, value] of Object.entries(params)) {
    result[key] = ENUM_PARAM_KEYS.has(key) && typeof value === 'string'
      ? denormalizeEnum(value)
      : value;
  }
  return result;
}

/** Convert PascalCase enum values in a request body to camelCase for the API. */
export function denormalizeBody<T extends Record<string, unknown>>(body: T): T {
  const result = { ...body } as Record<string, unknown>;
  if (typeof result.category === 'string') result.category = denormalizeEnum(result.category);
  if (typeof result.urgency === 'string') result.urgency = denormalizeEnum(result.urgency);
  if (typeof result.status === 'string') result.status = denormalizeEnum(result.status);
  return result as T;
}
