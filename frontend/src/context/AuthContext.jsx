import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginAPI, signupAPI, getMeAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('amazon_token');
      const storedUser = localStorage.getItem('amazon_user');

      if (!token) {
        setLoading(false);
        return;
      }

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('amazon_user');
        }
      }

      try {
        const response = await getMeAPI();
        const freshUser = response.data.user || response.data;
        setUser(freshUser);
        localStorage.setItem('amazon_user', JSON.stringify(freshUser));
      } catch (error) {
        console.error('Session verification failed:', error);
        localStorage.removeItem('amazon_token');
        localStorage.removeItem('amazon_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginAPI({ email, password });
      const { user, token } = response.data;

      localStorage.setItem('amazon_token', token);
      localStorage.setItem('amazon_user', JSON.stringify(user));
      setUser(user);

      return user;
    } catch (error) {
      if (error.response?.data?.errors) {
        const messages = error.response.data.errors.map((err) => err.msg).join('. ');
        throw new Error(messages);
      }

      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await signupAPI({ name, email, password });
      const { user, token } = response.data;

      localStorage.setItem('amazon_token', token);
      localStorage.setItem('amazon_user', JSON.stringify(user));
      setUser(user);

      return user;
    } catch (error) {
      if (error.response?.data?.errors) {
        const messages = error.response.data.errors.map((err) => err.msg).join('. ');
        throw new Error(messages);
      }

      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('amazon_token');
    localStorage.removeItem('amazon_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);