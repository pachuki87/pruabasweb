import React, { createContext, useContext, useEffect, useState } from 'react';
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

  useEffect(() => {
    let mounted = true;

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
          setUser(session?.user ?? null);
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

    // Listen for auth changes with improved error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;

        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            setUser(session?.user ?? null);
            break;
          case 'SIGNED_OUT':
            setUser(null);
            break;
          case 'TOKEN_REFRESHED':
            setUser(session?.user ?? null);
            break;
          case 'USER_UPDATED':
            setUser(session?.user ?? null);
            break;
          default:
            setUser(session?.user ?? null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  };

  const refreshSession = async () => {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Refresh session error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  };

  const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Get current user error:', error);
      return { success: false, error: error.message, user: null };
    }
    
    return { success: true, user };
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    refreshSession,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}