import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  useDefaultUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default user for testing when authentication fails
const DEFAULT_USER: User = {
  id: 'default-user-id',
  email: 'default@example.com',
  full_name: 'Default User',
  profession: 'Doctor',
  license_number: 'TEST-12345',
  total_cpd_points: 25,
  required_annual_points: 50,
  created_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session and get user
    const getSession = async () => {
      setLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error('Error fetching profile:', error);
          } else if (data) {
            setUser(data as User);
          }
        }
      } catch (error) {
        console.error('Session fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (error) {
              console.error('Profile fetch error:', error);
            } else if (data) {
              setUser(data as User);
            }
          } catch (error) {
            console.error('Auth state change error:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to use the default user for testing
  const useDefaultUser = () => {
    setUser(DEFAULT_USER);
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      // Step 1: Create the auth user
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: userData.full_name,
          },
          emailRedirectTo: window.location.origin + '/login'
        }
      });
      
      if (error) throw error;
      
      // Step 2: Create the profile record if user was created
      if (data.user) {
        // Use upsert to avoid conflicts
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email,
            full_name: userData.full_name || '',
            profession: userData.profession || '',
            license_number: userData.license_number || '',
            total_cpd_points: 0,
            required_annual_points: userData.required_annual_points || 50,
            created_at: new Date().toISOString()
          }, { onConflict: 'id' });
          
        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw profileError;
        }
      } else {
        throw new Error('User creation failed');
      }
    } catch (error) {
      console.error('Registration error details:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // If using default user, just clear the user state
      if (user?.id === DEFAULT_USER.id) {
        setUser(null);
        return;
      }
      
      // Otherwise, perform actual sign out
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    // If using default user, just update the local state
    if (user.id === DEFAULT_USER.id) {
      setUser({ ...user, ...updates });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) throw error;
      
      setUser({ ...user, ...updates });
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      updateProfile,
      useDefaultUser 
    }}>
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
