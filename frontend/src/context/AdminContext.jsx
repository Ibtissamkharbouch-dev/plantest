import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const AdminContext = createContext(null);
const STORAGE_KEY = 'student-registration-active-admin';

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAdmin = localStorage.getItem(STORAGE_KEY);
    if (savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch (_error) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const result = await api.adminLogin(username, password);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result.admin));
    setAdmin(result.admin);
    return result.admin;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAdmin(null);
  };

  const value = useMemo(() => ({ admin, loading, login, logout }), [admin, loading]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
