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
  global: {
    fetch: (...args) => {
      // Custom fetch with timeout and retry logic
      const [resource, config] = args;
      
      // Implement fetch with timeout
      const fetchWithTimeout = (url: RequestInfo | URL, options: RequestInit, timeout = 30000) => {
        return new Promise((resolve, reject) => {
          // Set timeout to abort the fetch
          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            controller.abort();
            reject(new Error(`Request timeout after ${timeout}ms`));
          }, timeout);
          
          // Add abort signal to options
          const updatedOptions = {
            ...options,
            signal: controller.signal,
          };
          
          fetch(url, updatedOptions)
            .then(response => {
              clearTimeout(timeoutId);
              resolve(response);
            })
            .catch(error => {
              clearTimeout(timeoutId);
              reject(error);
            });
        });
      };
      
      // Implement retry logic
      const fetchWithRetry = async (url: RequestInfo | URL, options: RequestInit, retries = 3, backoff = 300) => {
        let lastError;
        
        for (let i = 0; i < retries; i++) {
          try {
            return await fetchWithTimeout(url, options);
          } catch (error) {
            console.log(`Fetch attempt ${i + 1} failed, retrying in ${backoff}ms...`, error);
            lastError = error;
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, backoff));
            
            // Exponential backoff
            backoff *= 2;
          }
        }
        
        throw lastError;
      };
      
      return fetchWithRetry(resource, config || {});
    },
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
