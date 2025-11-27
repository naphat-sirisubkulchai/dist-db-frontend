'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '@/types';
import { authService } from '@/services/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          setToken(storedToken);
          const response = await authService.getMe(storedToken);
          // Backend returns { success: true, data: user }
          const userData = response?.data || response;
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    console.log('Login response:', response);
    // Backend returns { success: true, data: { token, user } }
    const data = response?.data || response;
    const { token, user } = data;
    
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    router.push('/');
  };

  const register = async (credentials: RegisterCredentials) => {
    const response = await authService.register(credentials);
    console.log('Register response:', response);
    // Backend returns { success: true, data: { token, user } }
    const data = response?.data || response;
    const { token, user } = data;
    
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
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
