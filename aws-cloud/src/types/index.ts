// ==========================================
// ERP EnterpriseCloud - Definiciones de Tipos
// Tipado estricto sin 'any' conforme a AGENTS.md
// ==========================================

export type UserRole = 'admin' | 'ventas' | 'compras' | 'almacen' | 'finanzas';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  department: string;
  lastLogin?: string;
  createdAt: string;
}

export type EntityStatus = 'activo' | 'inactivo';

export interface Customer {
  id: string;
  code: string;
  name: string;
  taxId: string; // RUC o NIF
  email: string;
  phone: string;
  address: string;
  city: string;
  creditLimit: number;
  currentDebt: number;
  status: EntityStatus;
  createdAt: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  taxId: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  paymentTerms: string; // ej. "30 días", "Contado"
  category: string;
  status: EntityStatus;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  location: string;
  isMain: boolean;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  categoryId: string;
  categoryName: string;
  unit: string; // "UND", "KG", "L", "MTR", etc.
  purchasePrice: number;
  salePrice: number;
  currentStock: number;
  minStock: number;
  maxStock: number;
  warehouseId: string;
  warehouseName: string;
  status: EntityStatus;
  updatedAt: string;
}

export type MovementType = 'ingreso' | 'egreso' | 'ajuste' | 'transferencia';

export interface StockMovement {
  id: string;
  date: string;
  productId: string;
  productName: string;
  productCode: string;
  type: MovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reference: string;
  warehouseName: string;
  notes: string;
  performedBy: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  taxPercent: number;
  subtotal: number;
  total: number;
}

export type SaleStatus = 'borrador' | 'confirmada' | 'pagada' | 'anulada';

export interface Sale {
  id: string;
  code: string; // VNT-2026-001
  customerId: string;
  customerName: string;
  customerTaxId: string;
  date: string;
  dueDate: string;
  status: SaleStatus;
  items: SaleItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  paymentMethod: 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Crédito';
  notes?: string;
  createdBy: string;
}

export type QuoteStatus = 'borrador' | 'enviada' | 'aprobada' | 'rechazada' | 'convertida';

export interface Quote {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  date: string;
  validUntil: string;
  status: QuoteStatus;
  items: SaleItem[];
  subtotal: number;
  taxTotal: number;
  total: number;
  notes?: string;
}

export type OrderStatus = 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';

export interface Order {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  date: string;
  deliveryDate: string;
  status: OrderStatus;
  items: SaleItem[];
  total: number;
  priority: 'Baja' | 'Media' | 'Alta' | 'Urgente';
}

export interface PurchaseItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
}

export type PurchaseStatus = 'solicitada' | 'aprobada' | 'recibida_parcial' | 'recibida_total' | 'cancelada';

export interface PurchaseOrder {
  id: string;
  code: string; // OC-2026-001
  supplierId: string;
  supplierName: string;
  supplierTaxId: string;
  date: string;
  expectedDate: string;
  status: PurchaseStatus;
  items: PurchaseItem[];
  subtotal: number;
  taxTotal: number;
  total: number;
  paymentTerms: string;
  notes?: string;
  requestedBy: string;
}

export interface Reception {
  id: string;
  code: string; // REC-2026-001
  purchaseOrderId: string;
  purchaseOrderCode: string;
  supplierName: string;
  date: string;
  itemsReceived: {
    productId: string;
    productName: string;
    quantity: number;
  }[];
  receivedBy: string;
  warehouseName: string;
  notes?: string;
}

export type FinanceStatus = 'pendiente' | 'parcial' | 'pagado' | 'vencido';

export interface AccountReceivable {
  id: string;
  saleCode: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  remainingAmount: number;
  status: FinanceStatus;
}

export interface AccountPayable {
  id: string;
  purchaseCode: string;
  supplierName: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  remainingAmount: number;
  status: FinanceStatus;
}

export interface CashMovement {
  id: string;
  date: string;
  type: 'ingreso' | 'egreso';
  concept: string;
  category: string;
  amount: number;
  account: string; // "Banco Principal", "Caja Chica"
  reference: string;
  status: 'completado' | 'anulado';
}

export type DocumentType = 'factura' | 'contrato' | 'orden_compra' | 'guia_remision' | 'informe' | 'otro';

export interface DocumentItem {
  id: string;
  name: string;
  type: DocumentType;
  fileFormat: string; // "pdf", "xlsx", "docx", "png"
  sizeBytes: number;
  relatedEntity: string; // ej. "Venta VNT-2026-001"
  uploadDate: string;
  uploadedBy: string;
  url?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: string; // "CREAR", "MODIFICAR", "ELIMINAR", "LOGIN", "EXPORTAR"
  module: string;
  details: string;
  ipAddress: string;
}

export interface CompanySettings {
  companyName: string;
  taxId: string;
  legalRepresentative: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  currency: string;
  taxRate: number; // 18% IGV o 16% IVA
  fiscalYear: number;
}

export type TimePeriod = '7d' | '30d' | '90d' | 'year';

export interface DashboardMetrics {
  period: TimePeriod;
  salesTotal: number;
  salesCount: number;
  salesGrowthPercent: number;
  purchasesTotal: number;
  purchasesCount: number;
  criticalStockCount: number;
  pendingReceivablesTotal: number;
  pendingPayablesTotal: number;
  grossMarginEstimated: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  read: boolean;
}
