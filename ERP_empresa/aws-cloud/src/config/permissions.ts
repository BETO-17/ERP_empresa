// ==========================================================
// ERP EnterpriseCloud - Matriz de permisos Rol <-> Módulo
// Fuente única usada por router, sidebar y páginas.
// Nota: es solo control de UX; el backend es la autoridad final.
// ==========================================================

import type { UserRole } from '../types';

export type ModuleKey =
  | 'dashboard'
  | 'profile'
  | 'customers'
  | 'sales'
  | 'quotesOrders'
  | 'suppliers'
  | 'purchases'
  | 'products'
  | 'warehouses'
  | 'finance'
  | 'documents'
  | 'administration'
  | 'reports';

export interface ModulePermission {
  /** Roles que pueden ver el módulo. */
  read: UserRole[];
  /** Roles que pueden crear/editar/eliminar. */
  write: UserRole[];
}

const ALL: UserRole[] = ['admin', 'ventas', 'compras', 'almacen', 'finanzas'];

export const MODULE_PERMISSIONS: Record<ModuleKey, ModulePermission> = {
  dashboard: { read: ALL, write: [] },
  profile: { read: ALL, write: ALL },
  customers: { read: ['admin', 'ventas', 'finanzas'], write: ['admin', 'ventas'] },
  sales: { read: ['admin', 'ventas', 'finanzas'], write: ['admin', 'ventas'] },
  quotesOrders: { read: ['admin', 'ventas'], write: ['admin', 'ventas'] },
  suppliers: { read: ['admin', 'compras', 'finanzas'], write: ['admin', 'compras'] },
  purchases: { read: ['admin', 'compras'], write: ['admin', 'compras'] },
  products: { read: ['admin', 'almacen', 'compras', 'ventas'], write: ['admin', 'almacen'] },
  warehouses: { read: ['admin', 'almacen'], write: ['admin', 'almacen'] },
  finance: { read: ['admin', 'finanzas'], write: ['admin', 'finanzas'] },
  documents: { read: ALL, write: ALL },
  administration: { read: ['admin'], write: ['admin'] },
  reports: { read: ALL, write: [] },
};

/** Roles que pueden ajustar stock (Kardex) además de quienes editan productos. */
export const STOCK_ADJUST_ROLES: UserRole[] = ['admin', 'almacen', 'compras'];
/** Roles que pueden gestionar pedidos (además de cotizaciones). */
export const ORDER_MANAGE_ROLES: UserRole[] = ['admin', 'ventas', 'almacen'];

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador General',
  ventas: 'Ejecutivo de Ventas',
  compras: 'Jefe de Compras',
  almacen: 'Encargado de Almacén',
  finanzas: 'Analista de Finanzas',
};

export const canRead = (role: UserRole, module: ModuleKey): boolean =>
  role === 'admin' || MODULE_PERMISSIONS[module].read.includes(role);

export const canWrite = (role: UserRole, module: ModuleKey): boolean =>
  role === 'admin' || MODULE_PERMISSIONS[module].write.includes(role);
