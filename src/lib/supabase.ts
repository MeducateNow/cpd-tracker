import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  // Increase timeout to 60 seconds
  realtime: {
    timeout: 60000,
  },
});

// Helper function to check Supabase connection
export const checkSupabaseConnection = async () => {
  try {
    // Simple ping to Supabase to check connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection check failed:', error);
      return { connected: false, error };
    }
    
    return { connected: true, data };
  } catch (err) {
    console.error('Network connection error:', err);
    return { connected: false, error: err };
  }
};
