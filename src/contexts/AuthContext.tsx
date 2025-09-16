import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; data?: any }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string; data?: any }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  refreshSession: () => Promise<{ success: boolean; error?: string; data?: any }>;
  getCurrentUser: () => Promise<{ success: boolean; error?: string; user: User | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoizar funciones para evitar re-renders innecesarios
  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  }, []);

  const refreshSession = useCallback(async () => {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Refresh session error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  }, []);

  const getCurrentUser = useCallback(async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Get current user error:', error);
      return { success: false, error: error.message, user: null };
    }
    
    return { success: true, user };
  }, []);

  useEffect(() => {
    let mounted = true;
    let lastUserId: string | null = null;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          const currentUser = session?.user ?? null;
          const currentUserId = currentUser?.id ?? null;
          
          // Solo actualizar si el usuario realmente cambió
          if (currentUserId !== lastUserId) {
            console.log('🔐 Initial auth state - User ID changed:', lastUserId, '->', currentUserId);
            setUser(currentUser);
            lastUserId = currentUserId;
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes with improved error handling and deduplication
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        const currentUser = session?.user ?? null;
        const currentUserId = currentUser?.id ?? null;
        
        // Solo procesar si el usuario realmente cambió
        if (currentUserId === lastUserId && event !== 'SIGNED_OUT') {
          console.log('🔐 Auth state change ignored - same user:', event, currentUserId);
          return;
        }

        console.log('🔐 Auth state changed:', event, 'User ID:', lastUserId, '->', currentUserId);
        
        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            setUser(currentUser);
            lastUserId = currentUserId;
            break;
          case 'SIGNED_OUT':
            setUser(null);
            lastUserId = null;
            break;
          case 'TOKEN_REFRESHED':
            // Solo actualizar si el usuario cambió
            if (currentUserId !== lastUserId) {
              setUser(currentUser);
              lastUserId = currentUserId;
            }
            break;
          case 'USER_UPDATED':
            setUser(currentUser);
            lastUserId = currentUserId;
            break;
          default:
            if (currentUserId !== lastUserId) {
              setUser(currentUser);
              lastUserId = currentUserId;
            }
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const value = React.useMemo(() => ({
    user,
    loading,
    signIn,
    signUp,
    signOut,
    refreshSession,
    getCurrentUser,
  }), [user, loading, signIn, signUp, signOut, refreshSession, getCurrentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}