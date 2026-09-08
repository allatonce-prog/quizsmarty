import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/user';
import { storageService, DEFAULT_USER_STATS } from '../services/storageService';
import { firebaseService } from '../services/firebase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  apiKey: string | null;
  setApiKey: (key: string) => Promise<void>;
  loginAnonymous: () => Promise<void>;
  loginEmail: (email: string, pass: string) => Promise<void>;
  registerEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileStats: (updater: (prev: UserProfile['stats']) => UserProfile['stats']) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiKey, setApiKeyState] = useState<string | null>(null);

  useEffect(() => {
    loadInitialAuth();
  }, []);

  const loadInitialAuth = async () => {
    try {
      const savedProfile = await storageService.getUserProfile();
      const savedKey = await storageService.getApiKey();
      setApiKeyState(savedKey);

      if (savedProfile) {
        setUser(savedProfile);
      } else {
        // Create default guest profile if none exists
        const defaultProfile: UserProfile = {
          uid: 'guest_' + Date.now(),
          email: null,
          displayName: 'Guest Student',
          isAnonymous: true,
          createdAt: new Date().toISOString(),
          stats: DEFAULT_USER_STATS,
        };
        await storageService.saveUserProfile(defaultProfile);
        setUser(defaultProfile);
      }
    } catch (e) {
      console.error('Auth initialization error:', e);
    } finally {
      setLoading(false);
    }
  };

  const setApiKey = async (key: string) => {
    await storageService.saveApiKey(key);
    setApiKeyState(key);
  };

  const loginAnonymous = async () => {
    setLoading(true);
    try {
      const fbUser = await firebaseService.loginAnonymous();
      const profile: UserProfile = {
        uid: fbUser.uid,
        email: null,
        displayName: 'Guest Student',
        isAnonymous: true,
        createdAt: new Date().toISOString(),
        stats: DEFAULT_USER_STATS,
      };
      await storageService.saveUserProfile(profile);
      setUser(profile);
    } finally {
      setLoading(false);
    }
  };

  const loginEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const fbUser = await firebaseService.loginEmail(email, pass);
      const existing = await storageService.getUserProfile();
      const profile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email || email,
        displayName: fbUser.email ? fbUser.email.split('@')[0] : 'Student',
        isAnonymous: false,
        createdAt: existing?.createdAt || new Date().toISOString(),
        stats: existing?.stats || DEFAULT_USER_STATS,
      };
      await storageService.saveUserProfile(profile);
      setUser(profile);
    } finally {
      setLoading(false);
    }
  };

  const registerEmail = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      const fbUser = await firebaseService.registerEmail(email, pass);
      const profile: UserProfile = {
        uid: fbUser.uid,
        email,
        displayName: name || email.split('@')[0],
        isAnonymous: false,
        createdAt: new Date().toISOString(),
        stats: DEFAULT_USER_STATS,
      };
      await storageService.saveUserProfile(profile);
      setUser(profile);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await firebaseService.logoutUser();
    await storageService.saveUserProfile({
      uid: 'guest_' + Date.now(),
      email: null,
      displayName: 'Guest Student',
      isAnonymous: true,
      createdAt: new Date().toISOString(),
      stats: DEFAULT_USER_STATS,
    });
    setUser(await storageService.getUserProfile());
  };

  const updateProfileStats = async (updater: (prev: UserProfile['stats']) => UserProfile['stats']) => {
    if (!user) return;
    const newStats = updater(user.stats);
    const updatedProfile = { ...user, stats: newStats };
    setUser(updatedProfile);
    await storageService.saveUserProfile(updatedProfile);
    await storageService.saveUserStats(newStats);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        apiKey,
        setApiKey,
        loginAnonymous,
        loginEmail,
        registerEmail,
        logout,
        updateProfileStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
