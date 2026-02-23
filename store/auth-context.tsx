import { setTokenGetter } from '@/services/api-client';
import {
  getSession,
  onAuthStateChange,
  signInWithEmail,
  signOut as authSignOut,
  signUp as authSignUp,
} from '@/services/auth';
import type { Session, User } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: typeof signInWithEmail;
  signUp: typeof authSignUp;
  signOut: typeof authSignOut;
  requireAuth: (callback: () => void) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    getSession()
      .then(({ data, error }) => {
        if (error) {
          console.warn('[auth] Failed to restore session:', error.message);
        }
        setSession(data.session);
      })
      .catch((error) => {
        console.warn('[auth] Unexpected error restoring session:', error);
        setSession(null);
      })
      .finally(() => {
        setLoading(false);
      });

    const { data: subscription } = onAuthStateChange(async (event, newSession) => {
      setSession(newSession);

      if (event === 'SIGNED_OUT') {
        queryClient.clear();
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, [queryClient]);

  useEffect(() => {
    setTokenGetter(() => session?.access_token ?? null);
    return () => setTokenGetter(null);
  }, [session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signIn: signInWithEmail,
      signUp: authSignUp,
      signOut: authSignOut,
      requireAuth: (callback: () => void) => {
        if (session) {
          callback();
        } else {
          // TODO(S11): navigate to /(auth)/login instead of warning
          console.warn('[auth] Action requires authentication');
        }
      },
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
