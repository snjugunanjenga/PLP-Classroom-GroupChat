import { createContext, useState, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    console.log('Logging in with:', { username, password });
    const { data } = await api.post('/api/auth/login', { username, password });
    localStorage.setItem('token', data.token);
    setUser({ username });
  };

  const register = async (username, password) => {
    const { data } = await api.post('/api/auth/register', { username, password });
    localStorage.setItem('token', data.token);
    setUser({ username });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);