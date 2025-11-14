import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthAPI, setAuthToken } from '../services/api';

const AuthContext = createContext({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  register: async () => {}
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    setAuthToken(token);
    if (token) {
      AuthAPI.me().then(setUser).catch(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      });
    }
  }, [token]);

  async function login(email, password) {
    const res = await AuthAPI.login(email, password);
    setToken(res.token);
    localStorage.setItem('token', res.token);
    setUser({ id: res.id, name: res.name, email: res.email });
    return res;
  }

  async function register(payload) {
    const res = await AuthAPI.register(payload);
    setToken(res.token);
    localStorage.setItem('token', res.token);
    setUser({ id: res.id, name: res.name, email: res.email });
    return res;
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}