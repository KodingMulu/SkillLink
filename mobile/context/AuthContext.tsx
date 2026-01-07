import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string, userData: User) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      await axios.post(`${apiUrl}/auth/logout`); 
    } catch (error) {
    } finally {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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