import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Cookies from 'js-cookie';
import { apiClient } from '@/lib/api';

export type UserRole = 'student' | 'teacher' | 'admin' | 'head';

export interface User {
  user_id: number;
  username: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
}

const parseJWT = (token: string): User | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return {
      user_id: payload.user_id,
      username: payload.username,
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

interface AuthContextType extends AuthState {
  logout: () => void;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Set to true for demo/mock mode
const USE_MOCK = true;

const MOCK_USER: User = {
  user_id: 1,
  username: 'admin_demo',
  role: 'admin',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: USE_MOCK ? MOCK_USER : null,
    isAuthenticated: USE_MOCK,
    isLoading: !USE_MOCK,
    accessToken: USE_MOCK ? 'mock-token' : null,
  });

  const refreshSession = useCallback(async (): Promise<boolean> => {
    if (USE_MOCK) return true;
    try {
      const refreshToken = Cookies.get('refresh_token');
      if (!refreshToken) return false;

      const response = await apiClient.post('/users/token/refresh/', {
        refresh: refreshToken,
      });
      const { access } = response.data;

      const user = parseJWT(access);
      if (!user) return false;

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        accessToken: access,
      });
      sessionStorage.setItem('access_token', access);
      return true;
    } catch {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        accessToken: null,
      });
      return false;
    }
  }, []);

  useEffect(() => {
    if (USE_MOCK) return;
    const initAuth = async () => {
      const existingToken = sessionStorage.getItem('access_token');
      if (existingToken && !isTokenExpired(existingToken)) {
        const user = parseJWT(existingToken);
        if (user) {
          setState({ user, isAuthenticated: true, isLoading: false, accessToken: existingToken });
          return;
        }
      }
      const refreshed = await refreshSession();
      if (!refreshed) {
        setState({ user: null, isAuthenticated: false, isLoading: false, accessToken: null });
      }
    };
    initAuth();
  }, [refreshSession]);

  const logout = useCallback(() => {
    Cookies.remove('refresh_token');
    sessionStorage.removeItem('access_token');
    setState({ user: null, isAuthenticated: false, isLoading: false, accessToken: null });
    window.location.href = '/';
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
