import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Sign up with email and password
  const signup = async (email, password, userData) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await result.user.getIdToken();
      
      // Register user in backend
      const response = await authAPI.register({
        id_token: idToken,
        ...userData
      });
      
      const { user, access_token } = response.data;
      
      // Store token and user data
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUserProfile(user);
      toast.success('Account created successfully!');
      
      return user;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.error || 'Failed to create account');
      throw error;
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await result.user.getIdToken();
      
      // Login user in backend
      const response = await authAPI.login({
        id_token: idToken
      });
      
      const { user, access_token } = response.data;
      
      // Store token and user data
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUserProfile(user);
      toast.success('Logged in successfully!');
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.error || 'Failed to log in');
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (userData) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      // Check if user exists in backend
      const verifyResponse = await authAPI.verifyToken({
        id_token: idToken
      });
      
      if (verifyResponse.data.exists) {
        // User exists, login
        const { user, access_token } = verifyResponse.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        setUserProfile(user);
        toast.success('Logged in successfully!');
        return user;
      } else {
        // User doesn't exist, register
        const registerResponse = await authAPI.register({
          id_token: idToken,
          name: result.user.displayName || userData?.name || 'Anonymous',
          profile_picture_url: result.user.photoURL,
          ...userData
        });
        
        const { user, access_token } = registerResponse.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        setUserProfile(user);
        toast.success('Account created successfully!');
        return user;
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Failed to sign in with Google');
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      setCurrentUser(null);
      setUserProfile(null);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      const response = await authAPI.updateCurrentUser(updates);
      const updatedUser = response.data.user;
      
      // Update local storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUserProfile(updatedUser);
      
      toast.success('Profile updated successfully!');
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
      throw error;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser && !!userProfile;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Check if we have stored user data
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('access_token');
        
        if (storedUser && storedToken) {
          setUserProfile(JSON.parse(storedUser));
        } else {
          // Try to get user profile from backend
          try {
            const idToken = await user.getIdToken();
            const response = await authAPI.verifyToken({ id_token: idToken });
            
            if (response.data.exists) {
              const { user: userData, access_token } = response.data;
              localStorage.setItem('access_token', access_token);
              localStorage.setItem('user', JSON.stringify(userData));
              setUserProfile(userData);
            }
          } catch (error) {
            console.error('Failed to get user profile:', error);
          }
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    signInWithGoogle,
    logout,
    updateProfile,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 