import { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext({
  user: null,
  isAuthed: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {}
});

const TOKEN_KEY = 'abdulflix_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .fetchMe()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleAuthSuccess = ({ user, token }) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    setUser(user);
    return user;
  };

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    return handleAuthSuccess(data);
  };

  const register = async (payload) => {
    const data = await authApi.register(payload);
    return handleAuthSuccess(data);
  };

  const logout = async () => {
    await authApi.logout();
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthed: Boolean(user),
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
