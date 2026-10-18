import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import type { User, UserRole } from '../../types';
import { INITIAL_USERS } from '../../services/mockData';
import { playLogoClickSound, playSecretUnlockSound } from '../../utils/soundEffects';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdminUnlocked: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasRole: (allowedRoles: UserRole[]) => boolean;
  unlockAdmin: () => void;
  lockAdmin: () => void;
  registerLogoClick: () => { count: number; justUnlocked: boolean; justLocked: boolean };
  // Alerta modal de acceso denegado en el centro
  isAccessDeniedOpen: boolean;
  accessDeniedMessage: string | null;
  triggerAccessDenied: (message?: string) => void;
  closeAccessDenied: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'erp_current_user';
const ADMIN_UNLOCKED_KEY = 'erp_admin_unlocked';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_UNLOCKED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        // Si el usuario guardado es admin pero aún no se ha desbloqueado, bajar a ventas
        const isUnlocked = sessionStorage.getItem(ADMIN_UNLOCKED_KEY) === 'true';
        if (parsed.role === 'admin' && !isUnlocked) {
          const defaultUser = INITIAL_USERS.find((u) => u.role === 'ventas') || INITIAL_USERS[1];
          sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
          return defaultUser;
        }
        return parsed;
      }
      // Por defecto el usuario inicial es Ventas (rol comercial no administrativo)
      const defaultUser = INITIAL_USERS.find((u) => u.role === 'ventas') || INITIAL_USERS[1];
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    } catch {
      return INITIAL_USERS.find((u) => u.role === 'ventas') || INITIAL_USERS[1];
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // Estado del Modal de Acceso Denegado (Rojo en el centro)
  const [isAccessDeniedOpen, setIsAccessDeniedOpen] = useState(false);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string | null>(null);

  const triggerAccessDenied = useCallback((message?: string) => {
    setAccessDeniedMessage(message || null);
    setIsAccessDeniedOpen(true);
  }, []);

  const closeAccessDenied = useCallback(() => {
    setIsAccessDeniedOpen(false);
    setAccessDeniedMessage(null);
  }, []);

  // Seguimiento de la secuencia de 5 clics en el logo
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);

  const unlockAdmin = useCallback(() => {
    setIsAdminUnlocked(true);
    sessionStorage.setItem(ADMIN_UNLOCKED_KEY, 'true');
    playSecretUnlockSound();
  }, []);

  const lockAdmin = useCallback(() => {
    setIsAdminUnlocked(false);
    sessionStorage.removeItem(ADMIN_UNLOCKED_KEY);
  }, []);

  const registerLogoClick = useCallback(() => {
    const now = Date.now();
    // Si pasaron más de 3.5 segundos desde el último clic, reiniciar el contador
    if (now - lastClickTimeRef.current > 3500) {
      clickCountRef.current = 1;
    } else {
      clickCountRef.current += 1;
    }
    lastClickTimeRef.current = now;

    const currentCount = clickCountRef.current;
    playLogoClickSound(currentCount);

    if (currentCount >= 5) {
      clickCountRef.current = 0;
      if (isAdminUnlocked) {
        // Deshabilitar modo admin
        lockAdmin();
        // Si el usuario actual tiene rol admin, cambiarlo al perfil operativo predeterminado (ventas)
        setUser((currentUser) => {
          if (currentUser?.role === 'admin') {
            const defaultUser = INITIAL_USERS.find((u) => u.role === 'ventas') || INITIAL_USERS[1];
            sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
            return defaultUser;
          }
          return currentUser;
        });
        return { count: 5, justUnlocked: false, justLocked: true };
      } else {
        // Habilitar modo admin
        unlockAdmin();
        return { count: 5, justUnlocked: true, justLocked: false };
      }
    }

    return { count: currentCount, justUnlocked: false, justLocked: false };
  }, [isAdminUnlocked, lockAdmin, unlockAdmin]);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 350));

    const found = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());

    // Si el usuario que intenta entrar es admin pero NO está desbloqueado el modo secreto:
    if (found && found.role === 'admin' && !isAdminUnlocked) {
      setIsLoading(false);
      triggerAccessDenied(
        'El perfil de Administrador General está protegido bajo protocolo de seguridad oculto. Se requiere realizar la secuencia de 5 clics sobre el logotipo corporativo para habilitar este acceso.'
      );
      throw new Error('ACCESO_ADMIN_BLOQUEADO');
    }

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
      role: 'ventas',
      department: 'Área Comercial',
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
    // Si intenta cambiar a admin pero no está desbloqueado:
    if (role === 'admin' && !isAdminUnlocked) {
      triggerAccessDenied(
        'No es posible cambiar al rol de Administrador. Este perfil se encuentra oculto y requiere 5 clics en el logo para ser activado.'
      );
      return;
    }

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
        isAdminUnlocked,
        login,
        logout,
        switchRole,
        hasRole,
        unlockAdmin,
        lockAdmin,
        registerLogoClick,
        isAccessDeniedOpen,
        accessDeniedMessage,
        triggerAccessDenied,
        closeAccessDenied,
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
