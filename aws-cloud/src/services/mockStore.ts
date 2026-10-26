// ========================================================
// ERP EnterpriseCloud - Mock Store con Persistencia Local
// Permite operaciones CRUD funcionales y realistas en Demo
// ========================================================

import type {
  Customer,
  Supplier,
  Product,
  Category,
  Warehouse,
  StockMovement,
  Sale,
  Quote,
  Order,
  PurchaseOrder,
  Reception,
  AccountReceivable,
  AccountPayable,
  CashMovement,
  DocumentItem,
  AuditLog,
  CompanySettings,
  User,
  DashboardMetrics,
  TimePeriod,
} from '../types';
import { pick, toNumber, toStatus } from '../utils/csv';

import {
  INITIAL_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_WAREHOUSES,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_SALES,
  INITIAL_QUOTES,
  INITIAL_ORDERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_RECEPTIONS,
  INITIAL_RECEIVABLES,
  INITIAL_PAYABLES,
  INITIAL_CASH_MOVEMENTS,
  INITIAL_DOCUMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_COMPANY_SETTINGS,
  INITIAL_USERS,
} from './mockData';

export type DataMode = 'vacio' | 'demo';

const DATA_MODE_KEY = 'erp_cloud_data_mode';

// Colecciones que se vacían al cambiar de modo (usuarios y empresa se conservan para poder iniciar sesión)
const DATA_KEYS = [
  'customers',
  'suppliers',
  'categories',
  'warehouses',
  'products',
  'stock_movements',
  'sales',
  'quotes',
  'orders',
  'purchase_orders',
  'receptions',
  'receivables',
  'payables',
  'cash_movements',
  'documents',
  'audit_logs',
];

export interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

const CLEAN_FLAG_KEY = 'erp_cloud_clean_v1';

class MockStore {
  constructor() {
    // Limpieza única de datos de negocio existentes (usuarios/roles y empresa se conservan)
    try {
      if (!localStorage.getItem(CLEAN_FLAG_KEY)) {
        for (const k of DATA_KEYS) localStorage.removeItem(`erp_cloud_${k}`);
        localStorage.setItem(DATA_MODE_KEY, 'vacio');
        localStorage.setItem(CLEAN_FLAG_KEY, '1');
      }
    } catch {
      // Ignorar
    }
  }

  getDataMode(): DataMode {
    try {
      return localStorage.getItem(DATA_MODE_KEY) === 'demo' ? 'demo' : 'vacio';
    } catch {
      return 'vacio';
    }
  }

  /** Cambia el modo y limpia los datos de negocio. 'vacio' = sin datos; 'demo' = datos de ejemplo. */
  setDataMode(mode: DataMode): void {
    try {
      localStorage.setItem(DATA_MODE_KEY, mode);
      for (const k of DATA_KEYS) localStorage.removeItem(`erp_cloud_${k}`);
    } catch {
      // Ignorar
    }
  }

  private seed<T>(demo: T[]): T[] {
    return this.getDataMode() === 'demo' ? demo : [];
  }

  private getStorage<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(`erp_cloud_${key}`);
      return item ? (JSON.parse(item) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  private setStorage<T>(key: string, data: T): void {
    try {
      localStorage.setItem(`erp_cloud_${key}`, JSON.stringify(data));
    } catch {
      // Manejo seguro en caso de que localStorage esté deshabilitado
    }
  }

  // --- Usuarios ---
  getUsers(): User[] {
    const list = this.getStorage<User[]>('users', INITIAL_USERS);
    return list.map((u) => ({
      ...u,
      isActive: u.isActive !== undefined ? u.isActive : true,
    }));
  }

  addUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}`,
      isActive: user.isActive !== undefined ? user.isActive : true,
      createdAt: new Date().toISOString(),
    };
    this.setStorage('users', [newUser, ...users]);
    this.logAction('Carlos Mendoza', 'admin', 'CREAR_USUARIO', 'Administración', `Usuario creado: ${newUser.name} (${newUser.email})`);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    const oldUser = users[idx];
    users[idx] = { ...users[idx], ...updates };
    this.setStorage('users', users);

    // Si cambió el estado de activación (activo/inactivo), registrar trazabilidad en auditoría
    if (updates.isActive !== undefined && updates.isActive !== oldUser.isActive) {
      this.logAction(
        'Carlos Mendoza',
        'admin',
        updates.isActive ? 'ACTIVAR_USUARIO' : 'DESACTIVAR_USUARIO',
        'Usuarios y Seguridad',
        `El Administrador ${updates.isActive ? 'activó' : 'desactivó'} el acceso corporativo de ${oldUser.name} (${oldUser.email}) con rol [${oldUser.role.toUpperCase()}].`
      );
    }
    return users[idx];
  }

  // --- Clientes ---
  getCustomers(): Customer[] {
    return this.getStorage<Customer[]>('customers', this.seed(INITIAL_CUSTOMERS));
  }

  addCustomer(customer: Omit<Customer, 'id' | 'code' | 'createdAt'>): Customer {
    const list = this.getCustomers();
    const nextCode = `CLI-${String(100 + list.length + 1).padStart(5, '0')}`;
    const newCustomer: Customer = {
      ...customer,
      id: `cust-${Date.now()}`,
      code: nextCode,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    this.setStorage('customers', [newCustomer, ...list]);
    this.logAction('Carlos Mendoza', 'admin', 'CREAR_CLIENTE', 'Clientes', `Nuevo cliente registrado: ${newCustomer.name} (${newCustomer.taxId})`);
    return newCustomer;
  }

  updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
    const list = this.getCustomers();
    const idx = list.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    this.setStorage('customers', list);
    return list[idx];
  }

  deleteCustomer(id: string): boolean {
    const list = this.getCustomers();
    const filtered = list.filter((c) => c.id !== id);
    if (filtered.length === list.length) return false;
    this.setStorage('customers', filtered);
    return true;
  }

  // --- Proveedores ---
  getSuppliers(): Supplier[] {
    return this.getStorage<Supplier[]>('suppliers', this.seed(INITIAL_SUPPLIERS));
  }

  addSupplier(supplier: Omit<Supplier, 'id' | 'code' | 'createdAt'>): Supplier {
    const list = this.getSuppliers();
    const nextCode = `PRV-${String(list.length + 1).padStart(3, '0')}`;
    const newSupplier: Supplier = {
      ...supplier,
      id: `sup-${Date.now()}`,
      code: nextCode,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    this.setStorage('suppliers', [newSupplier, ...list]);
    this.logAction('Jorge Salcedo', 'compras', 'CREAR_PROVEEDOR', 'Proveedores', `Proveedor añadido: ${newSupplier.name}`);
    return newSupplier;
  }

  updateSupplier(id: string, updates: Partial<Supplier>): Supplier | null {
    const list = this.getSuppliers();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    this.setStorage('suppliers', list);
    return list[idx];
  }

  deleteSupplier(id: string): boolean {
    const list = this.getSuppliers();
    const filtered = list.filter((s) => s.id !== id);
    if (filtered.length === list.length) return false;
    this.setStorage('suppliers', filtered);
    return true;
  }

  // --- Categorías y Almacenes ---
  getCategories(): Category[] {
    return this.getStorage<Category[]>('categories', this.seed(INITIAL_CATEGORIES));
  }

  getWarehouses(): Warehouse[] {
    return this.getStorage<Warehouse[]>('warehouses', this.seed(INITIAL_WAREHOUSES));
  }

  addCategory(category: Omit<Category, 'id' | 'productCount'>): Category {
    const list = this.getCategories();
    const newCat: Category = {
      ...category,
      id: `cat-${Date.now()}`,
      productCount: 0,
    };
    this.setStorage('categories', [...list, newCat]);
    return newCat;
  }

  // --- Productos ---
  getProducts(): Product[] {
    return this.getStorage<Product[]>('products', this.seed(INITIAL_PRODUCTS));
  }

  addProduct(product: Omit<Product, 'id' | 'updatedAt'>): Product {
    const list = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    this.setStorage('products', [newProduct, ...list]);
    this.logAction('Lucía Benítez', 'almacen', 'CREAR_PRODUCTO', 'Inventario', `Producto añadido: ${newProduct.name} (${newProduct.code})`);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const list = this.getProducts();
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
    this.setStorage('products', list);
    return list[idx];
  }

  // --- Movimientos de Stock / Kardex ---
  getStockMovements(): StockMovement[] {
    return this.getStorage<StockMovement[]>('stock_movements', this.seed(INITIAL_STOCK_MOVEMENTS));
  }

  adjustStock(params: {
    productId: string;
    quantity: number;
    type: 'ingreso' | 'egreso' | 'ajuste' | 'transferencia';
    reference: string;
    notes: string;
    performedBy: string;
    destinationWarehouse?: string;
  }): boolean {
    const products = this.getProducts();
    const pIdx = products.findIndex((p) => p.id === params.productId);
    if (pIdx === -1) return false;

    const product = products[pIdx];
    const prevStock = product.currentStock;
    let newStock = prevStock;

    if (params.type === 'ingreso') {
      newStock += params.quantity;
    } else if (params.type === 'egreso' || params.type === 'transferencia') {
      if (prevStock < params.quantity) return false; // Stock insuficiente
      newStock -= params.quantity;
    } else if (params.type === 'ajuste') {
      newStock = Math.max(0, prevStock + params.quantity);
    }

    products[pIdx].currentStock = newStock;
    products[pIdx].updatedAt = new Date().toISOString();
    this.setStorage('products', products);

    const movements = this.getStockMovements();
    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      date: new Date().toISOString(),
      productId: product.id,
      productName: product.name,
      productCode: product.code,
      type: params.type,
      quantity: params.quantity,
      previousStock: prevStock,
      newStock: newStock,
      reference: params.reference || 'Ajuste manual',
      warehouseName: params.destinationWarehouse
        ? `${product.warehouseName} -> ${params.destinationWarehouse}`
        : product.warehouseName,
      notes: params.notes,
      performedBy: params.performedBy || 'Operador',
    };

    this.setStorage('stock_movements', [movement, ...movements]);
    this.logAction(
      movement.performedBy,
      'almacen',
      `MOVIMIENTO_${params.type.toUpperCase()}`,
      'Inventario',
      `${params.type.toUpperCase()} de ${params.quantity} unds en ${product.code}: Stock ${prevStock} -> ${newStock}`
    );

    return true;
  }

  // --- Ventas ---
  getSales(): Sale[] {
    return this.getStorage<Sale[]>('sales', this.seed(INITIAL_SALES));
  }

  addSale(sale: Omit<Sale, 'id' | 'code'>): Sale {
    const list = this.getSales();
    const nextCode = `VNT-2026-${String(list.length + 1).padStart(3, '0')}`;
    const newSale: Sale = {
      ...sale,
      id: `sale-${Date.now()}`,
      code: nextCode,
    };
    this.setStorage('sales', [newSale, ...list]);

    // Disminuir inventario de los productos vendidos
    for (const item of newSale.items) {
      this.adjustStock({
        productId: item.productId,
        quantity: item.quantity,
        type: 'egreso',
        reference: `Venta ${nextCode}`,
        notes: `Salida automática por factura de venta ${nextCode}`,
        performedBy: newSale.createdBy,
      });
    }

    // Si la venta no está pagada (por ejemplo a crédito), crear cuenta por cobrar
    if (newSale.status !== 'pagada') {
      const receivables = this.getReceivables();
      const newAR: AccountReceivable = {
        id: `ar-${Date.now()}`,
        saleCode: nextCode,
        customerName: newSale.customerName,
        issueDate: newSale.date,
        dueDate: newSale.dueDate,
        totalAmount: newSale.total,
        remainingAmount: newSale.total,
        status: 'pendiente',
      };
      this.setStorage('receivables', [newAR, ...receivables]);
    } else {
      // Registrar ingreso en caja/bancos
      this.addCashMovement({
        type: 'ingreso',
        concept: `Cobro total por Venta ${nextCode} - ${newSale.customerName}`,
        category: 'Cobranza Comercial',
        amount: newSale.total,
        account: newSale.paymentMethod === 'Efectivo' ? 'Caja Central Lima' : 'Banco BCP Dólares Corriente',
        reference: `REC-${nextCode}`,
      });
    }

    this.logAction(newSale.createdBy, 'ventas', 'CREAR_VENTA', 'Ventas', `Venta registrada: ${nextCode} por ${newSale.total.toFixed(2)} USD`);
    return newSale;
  }

  updateSaleStatus(id: string, status: Sale['status']): Sale | null {
    const list = this.getSales();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    list[idx].status = status;
    this.setStorage('sales', list);
    return list[idx];
  }

  // --- Cotizaciones y Pedidos ---
  getQuotes(): Quote[] {
    return this.getStorage<Quote[]>('quotes', this.seed(INITIAL_QUOTES));
  }

  addQuote(quote: Omit<Quote, 'id' | 'code'>): Quote {
    const list = this.getQuotes();
    const nextCode = `COT-2026-${String(list.length + 89).padStart(3, '0')}`;
    const newQuote: Quote = {
      ...quote,
      id: `qt-${Date.now()}`,
      code: nextCode,
    };
    this.setStorage('quotes', [newQuote, ...list]);
    return newQuote;
  }

  updateQuoteStatus(id: string, status: Quote['status']): Quote | null {
    const list = this.getQuotes();
    const idx = list.findIndex((q) => q.id === id);
    if (idx === -1) return null;
    list[idx].status = status;
    this.setStorage('quotes', list);
    return list[idx];
  }

  getOrders(): Order[] {
    return this.getStorage<Order[]>('orders', this.seed(INITIAL_ORDERS));
  }

  addOrder(order: Omit<Order, 'id' | 'code'>): Order {
    const list = this.getOrders();
    const nextCode = `PED-2026-${String(list.length + 45).padStart(3, '0')}`;
    const newOrder: Order = {
      ...order,
      id: `ord-${Date.now()}`,
      code: nextCode,
    };
    this.setStorage('orders', [newOrder, ...list]);
    return newOrder;
  }

  updateOrderStatus(id: string, status: Order['status']): Order | null {
    const list = this.getOrders();
    const idx = list.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    list[idx].status = status;
    this.setStorage('orders', list);
    return list[idx];
  }

  // --- Compras y Órdenes de Compra ---
  getPurchaseOrders(): PurchaseOrder[] {
    return this.getStorage<PurchaseOrder[]>('purchase_orders', this.seed(INITIAL_PURCHASE_ORDERS));
  }

  addPurchaseOrder(po: Omit<PurchaseOrder, 'id' | 'code'>): PurchaseOrder {
    const list = this.getPurchaseOrders();
    const nextCode = `OC-2026-${String(list.length + 1).padStart(3, '0')}`;
    const newPO: PurchaseOrder = {
      ...po,
      id: `po-${Date.now()}`,
      code: nextCode,
    };
    this.setStorage('purchase_orders', [newPO, ...list]);
    this.logAction(newPO.requestedBy, 'compras', 'CREAR_ORDEN_COMPRA', 'Abastecimiento', `Orden de compra creada: ${nextCode} por ${newPO.total.toFixed(2)} USD`);
    return newPO;
  }

  updatePurchaseOrderStatus(id: string, status: PurchaseOrder['status']): PurchaseOrder | null {
    const list = this.getPurchaseOrders();
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    list[idx].status = status;
    this.setStorage('purchase_orders', list);

    // Si se aprueba o completa, crear cuenta por pagar si no existe
    if (status === 'aprobada' || status === 'recibida_total') {
      const payables = this.getPayables();
      if (!payables.some((p) => p.purchaseCode === list[idx].code)) {
        const newAP: AccountPayable = {
          id: `ap-${Date.now()}`,
          purchaseCode: list[idx].code,
          supplierName: list[idx].supplierName,
          issueDate: list[idx].date,
          dueDate: list[idx].expectedDate,
          totalAmount: list[idx].total,
          remainingAmount: list[idx].total,
          status: 'pendiente',
        };
        this.setStorage('payables', [newAP, ...payables]);
      }
    }
    return list[idx];
  }

  // --- Recepción de Mercancía ---
  getReceptions(): Reception[] {
    return this.getStorage<Reception[]>('receptions', this.seed(INITIAL_RECEPTIONS));
  }

  addReception(rec: Omit<Reception, 'id' | 'code'>): Reception {
    const list = this.getReceptions();
    const nextCode = `REC-2026-${String(list.length + 1).padStart(3, '0')}`;
    const newRec: Reception = {
      ...rec,
      id: `rec-${Date.now()}`,
      code: nextCode,
    };
    this.setStorage('receptions', [newRec, ...list]);

    // Incrementar inventario por los productos recibidos
    for (const item of newRec.itemsReceived) {
      this.adjustStock({
        productId: item.productId,
        quantity: item.quantity,
        type: 'ingreso',
        reference: `Recepción ${nextCode} (OC: ${newRec.purchaseOrderCode})`,
        notes: `Ingreso automático por recepción física de mercancía`,
        performedBy: newRec.receivedBy,
      });
    }

    this.logAction(newRec.receivedBy, 'almacen', 'RECEPCION_MERCANCIA', 'Abastecimiento', `Recepción completada: ${nextCode}`);
    return newRec;
  }

  // --- Finanzas ---
  getReceivables(): AccountReceivable[] {
    return this.getStorage<AccountReceivable[]>('receivables', this.seed(INITIAL_RECEIVABLES));
  }

  getPayables(): AccountPayable[] {
    return this.getStorage<AccountPayable[]>('payables', this.seed(INITIAL_PAYABLES));
  }

  getCashMovements(): CashMovement[] {
    return this.getStorage<CashMovement[]>('cash_movements', this.seed(INITIAL_CASH_MOVEMENTS));
  }

  addCashMovement(movement: Omit<CashMovement, 'id' | 'date' | 'status'>): CashMovement {
    const list = this.getCashMovements();
    const newMovement: CashMovement = {
      ...movement,
      id: `cm-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'completado',
    };
    this.setStorage('cash_movements', [newMovement, ...list]);
    return newMovement;
  }

  // --- Documentos ---
  getDocuments(): DocumentItem[] {
    return this.getStorage<DocumentItem[]>('documents', this.seed(INITIAL_DOCUMENTS));
  }

  addDocument(doc: Omit<DocumentItem, 'id' | 'uploadDate'>): DocumentItem {
    const list = this.getDocuments();
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString(),
    };
    this.setStorage('documents', [newDoc, ...list]);
    this.logAction(doc.uploadedBy, 'ventas', 'SUBIR_DOCUMENTO', 'Documentos', `Documento subido: ${newDoc.name} (${newDoc.relatedEntity})`);
    return newDoc;
  }

  deleteDocument(id: string): boolean {
    const list = this.getDocuments();
    const filtered = list.filter((d) => d.id !== id);
    if (filtered.length === list.length) return false;
    this.setStorage('documents', filtered);
    return true;
  }

  // --- Auditoría y Configuración ---
  getAuditLogs(): AuditLog[] {
    return this.getStorage<AuditLog[]>('audit_logs', this.seed(INITIAL_AUDIT_LOGS));
  }

  logAction(userName: string, userRole: AuditLog['userRole'], action: string, module: string, details: string): void {
    const list = this.getAuditLogs();
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userName,
      userRole,
      action,
      module,
      details,
      ipAddress: '192.168.1.100',
    };
    this.setStorage('audit_logs', [log, ...list.slice(0, 99)]);
  }

  getCompanySettings(): CompanySettings {
    return this.getStorage<CompanySettings>('company_settings', INITIAL_COMPANY_SETTINGS);
  }

  updateCompanySettings(settings: CompanySettings): void {
    this.setStorage('company_settings', settings);
    this.logAction('Carlos Mendoza', 'admin', 'ACTUALIZAR_CONFIGURACION', 'Administración', 'Parámetros de la empresa actualizados');
  }

  // --- Métricas del Dashboard con Filtros de Periodo ---
  getDashboardMetrics(period: TimePeriod = '30d'): DashboardMetrics {
    const sales = this.getSales();
    const purchases = this.getPurchaseOrders();
    const products = this.getProducts();
    const receivables = this.getReceivables();
    const payables = this.getPayables();

    // Filtro temporal simulado para el periodo seleccionado
    let multiplier = 1;
    if (period === '7d') multiplier = 0.28;
    else if (period === '90d') multiplier = 2.4;
    else if (period === 'year') multiplier = 8.5;

    const baseSalesTotal = sales.reduce((acc, s) => acc + s.total, 0);
    const basePurchasesTotal = purchases.reduce((acc, p) => acc + p.total, 0);

    const salesTotal = baseSalesTotal * multiplier;
    const purchasesTotal = basePurchasesTotal * multiplier;
    const criticalStockCount = products.filter((p) => p.currentStock <= p.minStock).length;
    const pendingReceivablesTotal = receivables
      .filter((r) => r.status !== 'pagado')
      .reduce((acc, r) => acc + r.remainingAmount, 0);
    const pendingPayablesTotal = payables
      .filter((p) => p.status !== 'pagado')
      .reduce((acc, p) => acc + p.remainingAmount, 0);

    return {
      period,
      salesTotal,
      salesCount: Math.round(sales.length * multiplier),
      salesGrowthPercent: 14.8,
      purchasesTotal,
      purchasesCount: Math.round(purchases.length * multiplier),
      criticalStockCount,
      pendingReceivablesTotal,
      pendingPayablesTotal,
      grossMarginEstimated: salesTotal > 0 ? ((salesTotal - purchasesTotal) / salesTotal) * 100 : 0,
    };
  }

  // --- Importación masiva desde CSV ---
  private mergeUnique<T>(
    key: string,
    current: T[],
    incoming: T[],
    keyOf: (item: T) => string
  ): void {
    const known = new Set(current.map((i) => keyOf(i).toLowerCase()));
    const fresh = incoming.filter((i) => !known.has(keyOf(i).toLowerCase()));
    this.setStorage(key, [...fresh, ...current]);
  }

  importCustomers(records: Record<string, string>[]): ImportResult {
    const current = this.getCustomers();
    const result: ImportResult = { imported: 0, skipped: 0, errors: [] };
    const seen = new Set(current.map((c) => c.taxId.toLowerCase()));
    const incoming: Customer[] = [];
    records.forEach((rec, idx) => {
      const name = pick(rec, 'name', 'razon social', 'nombre');
      const taxId = pick(rec, 'taxId', 'ruc', 'nif', 'ruc nif');
      if (!name || !taxId) {
        result.errors.push(`Fila ${idx + 2}: faltan nombre o RUC/NIF`);
        return;
      }
      if (seen.has(taxId.toLowerCase())) {
        result.skipped++;
        return;
      }
      seen.add(taxId.toLowerCase());
      incoming.push({
        id: `cust-${Date.now()}-${idx}`,
        code: `CLI-${String(100 + current.length + incoming.length + 1).padStart(5, '0')}`,
        name,
        taxId,
        email: pick(rec, 'email', 'correo'),
        phone: pick(rec, 'phone', 'telefono'),
        address: pick(rec, 'address', 'direccion'),
        city: pick(rec, 'city', 'ciudad'),
        creditLimit: toNumber(pick(rec, 'creditLimit', 'limite credito')),
        currentDebt: toNumber(pick(rec, 'currentDebt', 'deuda actual')),
        status: toStatus(pick(rec, 'status', 'estado')),
        createdAt: new Date().toISOString().slice(0, 10),
      });
    });
    this.mergeUnique('customers', current, incoming, (c) => c.taxId);
    result.imported = incoming.length;
    if (result.imported) this.logAction('Usuario', 'ventas', 'IMPORTAR_CSV', 'Clientes', `${result.imported} clientes importados desde CSV`);
    return result;
  }

  importSuppliers(records: Record<string, string>[]): ImportResult {
    const current = this.getSuppliers();
    const result: ImportResult = { imported: 0, skipped: 0, errors: [] };
    const seen = new Set(current.map((s) => s.taxId.toLowerCase()));
    const incoming: Supplier[] = [];
    records.forEach((rec, idx) => {
      const name = pick(rec, 'name', 'razon social', 'nombre');
      const taxId = pick(rec, 'taxId', 'ruc', 'nif', 'ruc nif');
      if (!name || !taxId) {
        result.errors.push(`Fila ${idx + 2}: faltan nombre o RUC/NIF`);
        return;
      }
      if (seen.has(taxId.toLowerCase())) {
        result.skipped++;
        return;
      }
      seen.add(taxId.toLowerCase());
      incoming.push({
        id: `sup-${Date.now()}-${idx}`,
        code: `PRV-${String(current.length + incoming.length + 1).padStart(3, '0')}`,
        name,
        taxId,
        email: pick(rec, 'email', 'correo'),
        phone: pick(rec, 'phone', 'telefono'),
        address: pick(rec, 'address', 'direccion'),
        contactPerson: pick(rec, 'contactPerson', 'contacto'),
        paymentTerms: pick(rec, 'paymentTerms', 'condiciones pago') || 'Contado',
        category: pick(rec, 'category', 'categoria') || 'General',
        status: toStatus(pick(rec, 'status', 'estado')),
        createdAt: new Date().toISOString().slice(0, 10),
      });
    });
    this.mergeUnique('suppliers', current, incoming, (s) => s.taxId);
    result.imported = incoming.length;
    if (result.imported) this.logAction('Usuario', 'compras', 'IMPORTAR_CSV', 'Proveedores', `${result.imported} proveedores importados desde CSV`);
    return result;
  }

  importProducts(records: Record<string, string>[]): ImportResult {
    const current = this.getProducts();
    const categories = this.getCategories();
    const warehouses = this.getWarehouses();
    const result: ImportResult = { imported: 0, skipped: 0, errors: [] };
    const seen = new Set(current.map((p) => p.code.toLowerCase()));
    const incoming: Product[] = [];

    records.forEach((rec, idx) => {
      const code = pick(rec, 'code', 'codigo', 'sku');
      const name = pick(rec, 'name', 'nombre', 'producto');
      if (!code || !name) {
        result.errors.push(`Fila ${idx + 2}: faltan código o nombre`);
        return;
      }
      if (seen.has(code.toLowerCase())) {
        result.skipped++;
        return;
      }
      seen.add(code.toLowerCase());

      const catName = pick(rec, 'category', 'categoria', 'familia') || 'General';
      let cat = categories.find((c) => c.name.toLowerCase() === catName.toLowerCase());
      if (!cat) {
        cat = { id: `cat-${Date.now()}-${idx}`, name: catName, description: '', productCount: 0 };
        categories.push(cat);
      }
      const whName = pick(rec, 'warehouse', 'almacen') || 'Almacén Principal';
      let wh = warehouses.find((w) => w.name.toLowerCase() === whName.toLowerCase());
      if (!wh) {
        wh = {
          id: `wh-${Date.now()}-${idx}`,
          code: `ALM-${String(warehouses.length + 1).padStart(2, '0')}`,
          name: whName,
          location: '',
          isMain: warehouses.length === 0,
        };
        warehouses.push(wh);
      }

      incoming.push({
        id: `prod-${Date.now()}-${idx}`,
        code,
        name,
        categoryId: cat.id,
        categoryName: cat.name,
        unit: pick(rec, 'unit', 'unidad') || 'UND',
        purchasePrice: toNumber(pick(rec, 'purchasePrice', 'precio compra')),
        salePrice: toNumber(pick(rec, 'salePrice', 'precio venta')),
        currentStock: toNumber(pick(rec, 'currentStock', 'stock', 'stock actual')),
        minStock: toNumber(pick(rec, 'minStock', 'stock minimo')),
        maxStock: toNumber(pick(rec, 'maxStock', 'stock maximo')),
        warehouseId: wh.id,
        warehouseName: wh.name,
        status: toStatus(pick(rec, 'status', 'estado')),
        updatedAt: new Date().toISOString(),
      });
    });

    if (incoming.length) {
      const withCounts = categories.map((c) => ({
        ...c,
        productCount: [...incoming, ...current].filter((p) => p.categoryId === c.id).length,
      }));
      this.setStorage('categories', withCounts);
      this.setStorage('warehouses', warehouses);
      this.setStorage('products', [...incoming, ...current]);
      this.logAction('Usuario', 'almacen', 'IMPORTAR_CSV', 'Inventario', `${incoming.length} productos importados desde CSV`);
    }
    result.imported = incoming.length;
    return result;
  }

  // Reiniciar a valores iniciales de prueba
  resetToInitial(): void {
    try {
      const keys = [
        'users',
        'customers',
        'suppliers',
        'categories',
        'warehouses',
        'products',
        'stock_movements',
        'sales',
        'quotes',
        'orders',
        'purchase_orders',
        'receptions',
        'receivables',
        'payables',
        'cash_movements',
        'documents',
        'audit_logs',
        'company_settings',
      ];
      for (const k of keys) {
        localStorage.removeItem(`erp_cloud_${k}`);
      }
    } catch {
      // Ignorar
    }
  }
}

export const mockStore = new MockStore();
