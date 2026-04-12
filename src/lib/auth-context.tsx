'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // Dev bypass: set NEXT_PUBLIC_DEV_BYPASS_AUTH=true in .env.local to skip auth
  const devBypass = process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true';

  const [user, setUser] = useState<User | null>(
    devBypass ? ({ id: 'dev-user', email: 'dev@visabud.test' } as unknown as User) : null
  );
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(devBypass ? false : true);

  useEffect(() => {
    if (devBypass) return; // Skip Supabase auth in dev mode

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [devBypass]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
