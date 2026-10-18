import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { RoleGuard } from '../components/RoleGuard';
import { LoginPage } from '../modules/auth/LoginPage';
import { UnauthorizedPage } from '../modules/auth/UnauthorizedPage';
import { DashboardPage } from '../modules/dashboard/DashboardPage';
import { CustomersPage } from '../modules/customers/CustomersPage';
import { SuppliersPage } from '../modules/suppliers/SuppliersPage';
import { ProductsPage } from '../modules/inventory/ProductsPage';
import { CategoriesWarehousesPage } from '../modules/inventory/CategoriesWarehousesPage';
import { SalesPage } from '../modules/sales/SalesPage';
import { QuotesOrdersPage } from '../modules/sales/QuotesOrdersPage';
import { PurchasesPage } from '../modules/purchases/PurchasesPage';
import { FinancePage } from '../modules/finance/FinancePage';
import { DocumentsPage } from '../modules/documents/DocumentsPage';
import { AdministrationPage } from '../modules/administration/AdministrationPage';
import { ReportsPage } from '../modules/reports/ReportsPage';

export const router = createBrowserRouter([
  // Rutas públicas / autenticación
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  // Rutas principales protegidas
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      // Dashboard — todos los roles autenticados
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      // Comercial
      {
        path: 'customers',
        element: (
          <RoleGuard allowedRoles={['admin', 'ventas', 'finanzas']}>
            <CustomersPage />
          </RoleGuard>
        ),
      },
      {
        path: 'sales',
        element: (
          <RoleGuard allowedRoles={['admin', 'ventas', 'finanzas']}>
            <SalesPage />
          </RoleGuard>
        ),
      },
      {
        path: 'quotes-orders',
        element: (
          <RoleGuard allowedRoles={['admin', 'ventas']}>
            <QuotesOrdersPage />
          </RoleGuard>
        ),
      },
      // Abastecimiento
      {
        path: 'suppliers',
        element: (
          <RoleGuard allowedRoles={['admin', 'compras', 'finanzas']}>
            <SuppliersPage />
          </RoleGuard>
        ),
      },
      {
        path: 'purchases',
        element: (
          <RoleGuard allowedRoles={['admin', 'compras']}>
            <PurchasesPage />
          </RoleGuard>
        ),
      },
      // Inventario
      {
        path: 'products',
        element: (
          <RoleGuard allowedRoles={['admin', 'almacen', 'compras', 'ventas']}>
            <ProductsPage />
          </RoleGuard>
        ),
      },
      {
        path: 'warehouses',
        element: (
          <RoleGuard allowedRoles={['admin', 'almacen']}>
            <CategoriesWarehousesPage />
          </RoleGuard>
        ),
      },
      // Finanzas
      {
        path: 'finance',
        element: (
          <RoleGuard allowedRoles={['admin', 'finanzas']}>
            <FinancePage />
          </RoleGuard>
        ),
      },
      // Documentos — todos los roles
      {
        path: 'documents',
        element: <DocumentsPage />,
      },
      // Administración — solo admin
      {
        path: 'administration',
        element: (
          <RoleGuard allowedRoles={['admin']}>
            <AdministrationPage />
          </RoleGuard>
        ),
      },
      // Reportes — todos los roles
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);
