import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import { supabase, checkSupabaseConnection } from '../lib/supabase';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    profession: '',
    licenseNumber: '',
    requiredPoints: 50,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Check Supabase connection on component mount and periodically
  useEffect(() => {
    const checkConnection = async () => {
      setConnectionStatus('checking');
      const { connected } = await checkSupabaseConnection();
      setNetworkError(!connected);
      setConnectionStatus(connected ? 'connected' : 'disconnected');
    };
    
    // Initial check
    checkConnection();
    
    // Set up periodic checks
    const intervalId = setInterval(checkConnection, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    // Check connection before attempting registration
    const { connected } = await checkSupabaseConnection();
    if (!connected) {
      setNetworkError(true);
      toast.error('Cannot connect to server. Please check your internet connection and try again.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Manual registration process with better error handling and retry logic
      let authData;
      let authError;
      
      // Try up to 3 times for auth signup
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const result = await supabase.auth.signUp({ 
            email: formData.email, 
            password: formData.password,
            options: {
              data: {
                full_name: formData.fullName,
              },
              emailRedirectTo: window.location.origin + '/login'
            }
          });
          
          authData = result.data;
          authError = result.error;
          
          if (!authError) break; // Success, exit retry loop
          
          console.log(`Auth signup attempt ${attempt + 1} failed, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        } catch (err) {
          console.error(`Auth signup attempt ${attempt + 1} exception:`, err);
          authError = err;
        }
      }
      
      if (authError) {
        throw authError;
      }
      
      if (!authData?.user) {
        throw new Error('User creation failed');
      }
      
      // Step 2: Create profile record
      let profileError;
      
      // Try up to 3 times for profile creation
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const result = await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              email: formData.email,
              full_name: formData.fullName,
              profession: formData.profession,
              license_number: formData.licenseNumber,
              total_cpd_points: 0,
              required_annual_points: parseInt(formData.requiredPoints.toString()),
              created_at: new Date().toISOString()
            }, { onConflict: 'id' });
            
          profileError = result.error;
          
          if (!profileError) break; // Success, exit retry loop
          
          console.log(`Profile creation attempt ${attempt + 1} failed, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        } catch (err) {
          console.error(`Profile creation attempt ${attempt + 1} exception:`, err);
          profileError = err;
        }
      }
        
      if (profileError) {
        console.error('Profile creation error after retries:', profileError);
        // Continue anyway - the auth user was created successfully
        toast.warning('Account created but profile setup had an issue. You can update your profile after login.');
      }
      
      // Sign out the user since we just want to register, not auto-login
      await supabase.auth.signOut();
      
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      console.error('Registration error:', error);
      
      // Network error detection
      if (error.message?.includes('fetch') || 
          error.message?.includes('network') || 
          error.message?.includes('timeout') || 
          error.message?.includes('abort') || 
          !navigator.onLine) {
        setNetworkError(true);
        toast.error('Network connection issue detected. Please check your internet connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to retry connection
  const retryConnection = async () => {
    setConnectionStatus('checking');
    toast.info('Checking connection...');
    
    const { connected } = await checkSupabaseConnection();
    setNetworkError(!connected);
    setConnectionStatus(connected ? 'connected' : 'disconnected');
    
    if (connected) {
      toast.success('Connection restored!');
    } else {
      toast.error('Still unable to connect. Please check your internet connection.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        {connectionStatus === 'checking' && (
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Checking Connection</h3>
                <div className="mt-2 text-sm text-yellow-700 flex items-center">
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Verifying connection to our servers...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {networkError && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Network Connection Issue</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    We're having trouble connecting to our servers. Please check your internet connection and try again.
                  </p>
                  <button 
                    onClick={retryConnection}
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Retry Connection
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
                Profession
              </label>
              <select
                id="profession"
                name="profession"
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={formData.profession}
                onChange={handleChange}
              >
                <option value="">Select your profession</option>
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Dentist">Dentist</option>
                <option value="Physiotherapist">Physiotherapist</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                License Number
              </label>
              <input
                id="licenseNumber"
                name="licenseNumber"
                type="text"
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.licenseNumber}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="requiredPoints" className="block text-sm font-medium text-gray-700">
                Required Annual CPD Points
              </label>
              <input
                id="requiredPoints"
                name="requiredPoints"
                type="number"
                min="0"
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.requiredPoints}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || connectionStatus !== 'connected'}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                connectionStatus === 'connected' 
                  ? 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? <LoadingSpinner size="small" /> : 'Create Account'}
            </button>
            {connectionStatus !== 'connected' && !isLoading && (
              <p className="mt-2 text-xs text-center text-red-600">
                Please wait until connection is established
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
