import React, { createContext, useContext, useState } from 'react';

// API base URL — set VITE_API_URL in .env for production; empty string works with the dev proxy.
const API_BASE = import.meta.env.VITE_API_URL ?? '';

export type AdminRole = 'super_admin' | 'admin';

interface AuthContextType {
  isAdmin: boolean;
  role: AdminRole | null;
  email: string | null;
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Read directly from sessionStorage so modules outside the component tree (ProductContext's
// fetch calls) can attach the header without needing useAuth().
export function getAuthHeader(): Record<string, string> {
  const token = sessionStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<AdminRole | null>(() => {
    return (sessionStorage.getItem('adminRole') as AdminRole | null) ?? null;
  });
  const [email, setEmail] = useState<string | null>(() => sessionStorage.getItem('adminEmail'));
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('isAdmin') === 'true';
  });

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdmin(true);
        setRole(data.role);
        setEmail(data.email);
        sessionStorage.setItem('isAdmin', 'true');
        sessionStorage.setItem('adminToken', data.token);
        sessionStorage.setItem('adminRole', data.role);
        sessionStorage.setItem('adminEmail', data.email);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    const token = sessionStorage.getItem('adminToken');
    if (token) {
      fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => { /* best-effort */ });
    }
    setIsAdmin(false);
    setRole(null);
    setEmail(null);
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminRole');
    sessionStorage.removeItem('adminEmail');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, role, email, isSuperAdmin: role === 'super_admin', login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
