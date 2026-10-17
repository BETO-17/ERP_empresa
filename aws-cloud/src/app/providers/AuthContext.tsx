import React, { createContext, useContext, useState } from 'react';
import type { User, UserRole } from '../../types';
import { INITIAL_USERS } from '../../services/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasRole: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'erp_current_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as User;
      }
      const defaultAdmin = INITIAL_USERS[0];
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultAdmin));
      return defaultAdmin;
    } catch {
      return INITIAL_USERS[0];
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    // Simular latencia de verificación
    await new Promise((res) => setTimeout(res, 400));

    const found = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(found));
      sessionStorage.setItem('erp_session_token', `mock-jwt-token-${found.id}`);
      setIsLoading(false);
      return true;
    }

    // Permitir acceso con cualquier correo para pruebas de demostración
    const customUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'admin',
      department: 'Administración General',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setUser(customUser);
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(customUser));
    sessionStorage.setItem('erp_session_token', `mock-jwt-token-${customUser.id}`);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem('erp_session_token');
  };

  const switchRole = (role: UserRole) => {
    const userForRole = INITIAL_USERS.find((u) => u.role === role) || {
      id: `usr-${role}`,
      name: `Usuario ${role.toUpperCase()}`,
      email: `${role}@enterprisecloud.erp`,
      role,
      department: `Departamento de ${role}`,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setUser(userForRole);
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userForRole));
  };

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Administrador tiene acceso total
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
