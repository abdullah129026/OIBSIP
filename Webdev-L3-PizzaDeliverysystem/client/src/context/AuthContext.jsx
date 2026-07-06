import { createContext, useContext, useEffect, useState } from 'react';

import { setToken, clearToken, getToken, fetchMe } from '@/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      if (!getToken()) {
        setReady(true);
        return;
      }
      const { data, error } = await fetchMe();
      if (error) {
        clearToken();
        setUser(null);
      } else {
        setUser(data?.user ?? null);
      }
      setReady(true);
    };
    hydrate();
  }, []);

  const login = ({ token, user: nextUser }) => {
    if (token) setToken(token);
    setUser(nextUser ?? null);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const value = {
    user,
    ready,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
