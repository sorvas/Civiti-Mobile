import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/constants/api';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// --- Storage adapter ---
// SecureStore has a ~2 KB value limit. Supabase sessions are 3-6 KB.
// This adapter chunks large values across multiple SecureStore keys.

const canUseLocalStorage =
  Platform.OS === 'web' && typeof localStorage !== 'undefined';

async function getItemNative(key: string): Promise<string | null> {
  const countStr = await SecureStore.getItemAsync(`${key}_count`);
  if (countStr) {
    const count = parseInt(countStr, 10);
    const chunks = await Promise.all(
      Array.from({ length: count }, (_, i) =>
        SecureStore.getItemAsync(`${key}_${i}`),
      ),
    );
    return chunks.join('');
  }
  // Fall back to non-chunked read for sessions stored before this adapter
  return SecureStore.getItemAsync(key);
}

async function setItemNative(key: string, value: string): Promise<void> {
  const chunks = value.match(/.{1,2048}/g) ?? [];
  await SecureStore.setItemAsync(`${key}_count`, String(chunks.length));
  await Promise.all(
    chunks.map((chunk, i) => SecureStore.setItemAsync(`${key}_${i}`, chunk)),
  );
}

async function removeItemNative(key: string): Promise<void> {
  const countStr = await SecureStore.getItemAsync(`${key}_count`);
  if (countStr) {
    const count = parseInt(countStr, 10);
    await Promise.all(
      Array.from({ length: count }, (_, i) =>
        SecureStore.deleteItemAsync(`${key}_${i}`),
      ),
    );
    await SecureStore.deleteItemAsync(`${key}_count`);
  }
  // Also delete the non-chunked key (migration from before this adapter)
  await SecureStore.deleteItemAsync(key);
}

const storageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    if (canUseLocalStorage) return localStorage.getItem(key);
    if (Platform.OS !== 'web') return getItemNative(key);
    return null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (canUseLocalStorage) {
      localStorage.setItem(key, value);
    } else if (Platform.OS !== 'web') {
      await setItemNative(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (canUseLocalStorage) {
      localStorage.removeItem(key);
    } else if (Platform.OS !== 'web') {
      await removeItemNative(key);
    }
  },
};

// --- Supabase client ---

const isMissingConfig = !SUPABASE_URL || !SUPABASE_ANON_KEY;

if (isMissingConfig && __DEV__) {
  console.warn(
    '[auth] SUPABASE_URL or SUPABASE_ANON_KEY is not configured. ' +
      'Auth will not work. See .env.example.',
  );
}

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder',
  {
    auth: {
      storage: storageAdapter,
      autoRefreshToken: true,
      persistSession: true,
      // OAuth callback tokens are extracted manually via expo-linking (see S11)
      detectSessionInUrl: false,
    },
  },
);

// --- Auth functions ---

export function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export function signInWithOAuth(provider: 'google' | 'apple') {
  return supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: 'civitimobile://auth/callback' },
  });
}

export function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export function signOut() {
  return supabase.auth.signOut();
}

export function getSession() {
  return supabase.auth.getSession();
}

export function onAuthStateChange(
  callback: Parameters<typeof supabase.auth.onAuthStateChange>[0],
) {
  return supabase.auth.onAuthStateChange(callback);
}

export function resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email);
}
