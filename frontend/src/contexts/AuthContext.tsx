import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfile } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUserProfile: (p: Partial<UserProfile>) => Promise<void>;
  reloadProfile: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('investai_token'));
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const reloadProfile = async () => {
    if (user?.id) {
      try {
        const p = await authService.fetchProfile(user.id);
        setProfile(p);
      } catch (err) {
        console.error('Profile fetch failed:', err);
      }
    }
  };

  useEffect(() => {
    if (user?.id) {
      reloadProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('investai_token', newToken);
    localStorage.setItem('investai_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setProfile(null);
    authService.logout();
  };

  const updateUserProfile = async (p: Partial<UserProfile>) => {
    if (!user?.id) return;
    const updated = await authService.updateProfile(user.id, p);
    setProfile(updated);
  };

  return (
    <AuthContext.Provider value={{ user, profile, token, login, logout, updateUserProfile, reloadProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
