import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/api';

const AuthContext = createContext({});


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // Start as true until auth is initialized

  // Internal function that just loads profile without managing loading state
  const _loadProfileInternal = async (userId, retries = 3) => {

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      // console.log('_loadProfileInternal: Query result -', { data, error });
      
      if (error) {
        console.error('_loadProfileInternal: Query error:', error.code, error.message);
        
        // Profile doesn't exist yet - retry with delay (trigger might be creating it)
        if (retries > 0 && error.code === 'PGRST116') {
          // console.log(`Profile not found. Retrying in 1 second... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return _loadProfileInternal(userId, retries - 1);
        }
        
        console.error('Profile load error - giving up:', error);
        setProfile(null);
        return null;
      }
      
      // console.log('_loadProfileInternal: Profile loaded successfully:', data);
      setProfile(data);
      return data;
    } catch (error) {
      console.error('_loadProfileInternal: Catch error:', error);
      setProfile(null);
      return null;
    }
  };

  // Public function for external calls - manages loading state
  const loadProfile = async (userId, retries = 3) => {
    try {
      setLoading(true);
      return await _loadProfileInternal(userId, retries);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log('AuthProvider useEffect triggered - Setting up auth listener');
    
    // Listen for auth changes (login, logout, refresh, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // console.log('Auth state changed - Event:', event, 'Session:', session?.user?.id);
      
      // Handle async operations properly without making the callback async
      (async () => {
        try {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // console.log('User authenticated, loading profile:', session.user.id);
            await _loadProfileInternal(session.user.id);
            // console.log('Profile loading completed');
          } else {
            // console.log('User logged out, clearing profile');
            setProfile(null);
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
        } finally {
          // console.log('Setting loading to false');
          setLoading(false);
        }
      })();
    });

    // Cleanup subscription on unmount
    return () => {
      // console.log('AuthProvider unmounting, unsubscribing');
      subscription?.unsubscribe();
    };
  }, []);

  const createProfileManually = async (userId, userData) => {
    try {
      // console.log('Creating profile manually for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          name: userData.name,
          email: userData.email,
          role: userData.role || 'student',
          avatar_url: userData.avatar_url || null
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Manual profile creation error:', error);
        throw error;
      }
      
      // console.log('Profile created successfully:', data);
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error in createProfileManually:', error);
      throw error;
    }
  };

  const signUp = async (email, password, name, role = 'student') => {
    try {
      // console.log('Starting signup process...', { email, name, role });
      setLoading(true);
      
      // Step 1: Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });
      
      if (signUpError) {
        console.error('Signup error:', signUpError);
        setLoading(false);
        throw signUpError;
      }

      // console.log('Auth signup successful:', authData.user?.id);

      // Step 2: Create profile via backend API (more reliable than trigger)
      if (authData.user) {
        // console.log('Creating profile via API...');
        
        try {
          const response = await fetch('/api/auth/ensure-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: authData.user.id,
              email,
              name,
              role
            })
          });

          if (!response.ok) {
            throw new Error(`Profile creation failed: ${response.statusText}`);
          }

          const profile = await response.json();
          // console.log('Profile created successfully:', profile);
          setProfile(profile);
          setLoading(false);
        } catch (profileError) {
          console.error('Failed to create profile via API:', profileError);
          // Still load profile with retries - it might exist or get created by trigger
          await loadProfile(authData.user.id);
        }
      }
      
      return authData;
    } catch (error) {
      console.error('Signup error:', error);
      setLoading(false);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      // console.log('Starting signin process...', { email });
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Signin error:', error);
        throw error;
      }
      
      // console.log('Signin successful:', data.user?.id);
      
      // Load profile after signin
      if (data.user) {
        await loadProfile(data.user.id);
      }
      
      return data;
    } catch (error) {
      console.error('Signin error:', error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // console.log('Signing out user...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Signout error:', error);
        throw error;
      }
      
      // console.log('User signed out successfully');
      // Clear both user and profile state
      setUser(null);
      setProfile(null);
      setLoading(false);
    } catch (error) {
      console.error('Error during signout:', error);
      // Force clear state even if signout fails
      setUser(null);
      setProfile(null);
      throw error;
    }
  };

  const updateProfile = async (updates) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      signUp, 
      signIn, 
      signOut,
      updateProfile,
      loadProfile,
      createProfileManually,
      loading,
      isInstructor: profile?.role === 'instructor' || profile?.role === 'admin',
      isAdmin: profile?.role === 'admin'
    }}>
      {!loading && children}
      {loading && (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
           <div className="pt-16 min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
