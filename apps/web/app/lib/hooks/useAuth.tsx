'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authStorage } from '../auth-storage';
import { getToken, setToken, removeToken } from '../auth-cookie';

export interface User {
  id: string;
  nickname: string;
  isAdmin: boolean;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
}

interface AuthActions {
  login: (user: User) => void;
  logout: () => void;
  saveCredentials: (nickname: string, password: string) => void;
  clearCredentials: () => void;
  refreshToken: () => Promise<boolean>;
}

interface AuthContextValue extends AuthState, AuthActions {}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    isLoading: true,
  });
  const router = useRouter();

  useEffect(() => {
    const token = authStorage.getAccessToken();
    const nickname = authStorage.getNickname();
    
    if (token && nickname) {
      setToken(token);
      setState({
        isLoggedIn: true,
        user: { id: '', nickname, isAdmin: false },
        isLoading: false,
      });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = (user: User, accessToken?: string) => {
    if (accessToken) {
      authStorage.setAccessToken(accessToken);
      setToken(accessToken);
    }
    setState({ isLoggedIn: true, user, isLoading: false });
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API error:', error);
    }
    
    authStorage.clearAll();
    removeToken();
    setState({ isLoggedIn: false, user: null, isLoading: false });
    router.push('/');
  };

  const saveCredentials = (nickname: string, password: string) => {
    authStorage.setNickname(nickname);
    authStorage.setPassword(password);
  };

  const clearCredentials = () => {
    authStorage.removeNickname();
    authStorage.removePassword();
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = authStorage.getRefreshToken();
      if (!refreshToken) return false;

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        authStorage.setAccessToken(data.accessToken);
        setToken(data.accessToken);
        if (data.refreshToken) {
          authStorage.setRefreshToken(data.refreshToken);
        }
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, saveCredentials, clearCredentials, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
