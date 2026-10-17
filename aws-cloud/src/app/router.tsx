import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
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
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'customers',
        element: <CustomersPage />,
      },
      {
        path: 'suppliers',
        element: <SuppliersPage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'warehouses',
        element: <CategoriesWarehousesPage />,
      },
      {
        path: 'sales',
        element: <SalesPage />,
      },
      {
        path: 'quotes-orders',
        element: <QuotesOrdersPage />,
      },
      {
        path: 'purchases',
        element: <PurchasesPage />,
      },
      {
        path: 'finance',
        element: <FinancePage />,
      },
      {
        path: 'documents',
        element: <DocumentsPage />,
      },
      {
        path: 'administration',
        element: <AdministrationPage />,
      },
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
