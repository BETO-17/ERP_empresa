import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../app/providers/AuthContext';
import type { UserRole } from '../types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

/**
 * RoleGuard — Protege una ruta verificando que el usuario tenga el rol requerido.
 * Si no tiene acceso, redirige a /unauthorized.
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { hasRole, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
