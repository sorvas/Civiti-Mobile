import { API_BASE_URL } from '@/constants/api';
import type { ApiErrorResponse } from '@/types/api';

import { ApiError, AuthError, NetworkError } from './errors';

type TokenGetter = () =>
  | string
  | null
  | undefined
  | Promise<string | null | undefined>;

let tokenGetter: TokenGetter | null = null;

export function setTokenGetter(getter: TokenGetter | null): void {
  tokenGetter = getter;
}

type QueryParams = Record<string, string | number | boolean | undefined | null>;

interface ApiClientOptions extends Omit<RequestInit, 'body'> {
  authenticated?: boolean;
  params?: QueryParams;
  body?: unknown;
}

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>,
): string {
  const url = `${API_BASE_URL}${path}`;
  if (!params) return url;

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value != null) {
      searchParams.append(key, String(value));
    }
  }

  const qs = searchParams.toString();
  return qs ? `${url}?${qs}` : url;
}

export async function apiClient<T>(
  path: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { authenticated = true, params, body, headers, ...fetchOptions } =
    options;

  const requestHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  if (body != null) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (authenticated) {
    if (!tokenGetter) {
      throw new AuthError();
    }
    const token = await Promise.resolve(tokenGetter());
    if (!token) {
      throw new AuthError();
    }
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const url = buildUrl(path, params);

  let response: Response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
      body: body != null ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new NetworkError();
    }
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (!response.ok) {
    let message = response.statusText;
    let requestId: string | undefined;

    try {
      const errorBody: ApiErrorResponse = await response.json();
      message = errorBody.error || message;
      requestId = errorBody.requestId;
    } catch {
      // Use statusText if body isn't parseable
    }

    throw new ApiError(response.status, message, requestId);
  }

  return response.json() as Promise<T>;
}
