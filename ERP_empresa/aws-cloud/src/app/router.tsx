import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { RoleGuard } from '../components/RoleGuard';
import { LoginPage } from '../modules/auth/LoginPage';
import { UnauthorizedPage } from '../modules/auth/UnauthorizedPage';
import { DashboardPage } from '../modules/dashboard/DashboardPage';
import { ProfilePage } from '../modules/profile/ProfilePage';
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
import { LandingPage } from '../modules/landing/LandingPage';
import { MODULE_PERMISSIONS } from '../config/permissions';

export const router = createBrowserRouter([
  // Ruta pública: Landing Page
  {
    path: '/landing',
    element: <LandingPage />,
  },
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
      // Perfil del usuario actual
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      // Comercial
      {
        path: 'customers',
        element: (
          <RoleGuard allowedRoles={MODULE_PERMISSIONS.customers.read}>
            <CustomersPage />
          </RoleGuard>
        ),
      },
      {
        path: 'sales',
        element: (
          <RoleGuard allowedRoles={MODULE_PERMISSIONS.sales.read}>
            <SalesPage />
          </RoleGuard>
        ),
      },
      {
        path: 'quotes-orders',
        element: (
          <RoleGuard allowedRoles={MODULE_PERMISSIONS.quotesOrders.read}>
            <QuotesOrdersPage />
          </RoleGuard>
        ),
      },
      // Abastecimiento
      {
        path: 'suppliers',
        element: (
          <RoleGuard allowedRoles={MODULE_PERMISSIONS.suppliers.read}>
            <SuppliersPage />
          </RoleGuard>
        ),
      },
      {
        path: 'purchases',
        element: (
          <RoleGuard allowedRoles={MODULE_PERMISSIONS.purchases.read}>
            <PurchasesPage />
          </RoleGuard>
        ),
      },
      // Inventario
      {
        path: 'products',
        element: (
          <RoleGuard allowedRoles={MODULE_PERMISSIONS.products.read}>
            <ProductsPage />
          </RoleGuard>
        ),
      },
      {
        path: 'warehouses',
        element: (
          <RoleGuard allowedRoles={MODULE_PERMISSIONS.warehouses.read}>
            <CategoriesWarehousesPage />
          </RoleGuard>
        ),
      },
      // Finanzas
      {
        path: 'finance',
        element: (
          <RoleGuard allowedRoles={MODULE_PERMISSIONS.finance.read}>
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
          <RoleGuard allowedRoles={MODULE_PERMISSIONS.administration.read}>
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
