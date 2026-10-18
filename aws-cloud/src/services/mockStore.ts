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

class MockStore {
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
    return this.getStorage<Customer[]>('customers', INITIAL_CUSTOMERS);
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
    return this.getStorage<Supplier[]>('suppliers', INITIAL_SUPPLIERS);
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
    return this.getStorage<Category[]>('categories', INITIAL_CATEGORIES);
  }

  getWarehouses(): Warehouse[] {
    return this.getStorage<Warehouse[]>('warehouses', INITIAL_WAREHOUSES);
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
    return this.getStorage<Product[]>('products', INITIAL_PRODUCTS);
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
    return this.getStorage<StockMovement[]>('stock_movements', INITIAL_STOCK_MOVEMENTS);
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
    return this.getStorage<Sale[]>('sales', INITIAL_SALES);
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
    return this.getStorage<Quote[]>('quotes', INITIAL_QUOTES);
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
    return this.getStorage<Order[]>('orders', INITIAL_ORDERS);
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
    return this.getStorage<PurchaseOrder[]>('purchase_orders', INITIAL_PURCHASE_ORDERS);
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
    return this.getStorage<Reception[]>('receptions', INITIAL_RECEPTIONS);
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
    return this.getStorage<AccountReceivable[]>('receivables', INITIAL_RECEIVABLES);
  }

  getPayables(): AccountPayable[] {
    return this.getStorage<AccountPayable[]>('payables', INITIAL_PAYABLES);
  }

  getCashMovements(): CashMovement[] {
    return this.getStorage<CashMovement[]>('cash_movements', INITIAL_CASH_MOVEMENTS);
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
    return this.getStorage<DocumentItem[]>('documents', INITIAL_DOCUMENTS);
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
    return this.getStorage<AuditLog[]>('audit_logs', INITIAL_AUDIT_LOGS);
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
