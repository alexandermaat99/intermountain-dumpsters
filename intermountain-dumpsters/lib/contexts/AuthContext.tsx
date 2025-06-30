'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error refreshing session:', error);
        setSession(null);
        setUser(null);
      } else {
        console.log('Session refreshed:', currentSession ? 'Session exists' : 'No session');
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      setSession(null);
      setUser(null);
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting signout process...');
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Signout error:', error);
        throw error;
      }
      
      console.log('Supabase signout successful, clearing local state...');
      
      // Clear local state
      setUser(null);
      setSession(null);
      
      console.log('Local state cleared, redirecting...');
      
      // Force a hard redirect to clear any cached state
      window.location.href = '/';
    } catch (error) {
      console.error('Signout failed:', error);
      // Even if there's an error, try to clear local state and redirect
      setUser(null);
      setSession(null);
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('AuthProvider mounted, initializing...');
    
    // Get initial session
    refreshSession().finally(() => {
      setLoading(false);
      console.log('Initial session loaded');
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT') {
          console.log('SIGNED_OUT event received, clearing state...');
          setUser(null);
          setSession(null);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      }
    );

    return () => {
      console.log('AuthProvider unmounting, cleaning up subscription...');
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading,
    signOut,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 