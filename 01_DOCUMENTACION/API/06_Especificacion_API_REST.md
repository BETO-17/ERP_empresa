# 06. ESPECIFICACIÓN TÉCNICA DE LA API REST
## ERP EnterpriseCloud API (FastAPI)

> **Base URL:** `http://localhost:8000/api/v1` (o dominio del ALB en AWS)  
> **Autenticación:** Encabezado HTTP `Authorization: Bearer <JWT_TOKEN>`

---

## Catálogo de Endpoints (Sección 15)

### 1. Autenticación y Usuarios
* `POST /auth/login`: Autentica credenciales y devuelve el token JWT con datos del usuario y rol.
* `GET /auth/me`: Obtiene los datos del usuario autenticado actualmente.
* `GET /users`: Listado de usuarios corporativos (requiere rol `admin`).
* `POST /users`: Creación de un nuevo usuario corporativo.
* `PATCH /users/{id}/toggle-active`: Activa o desactiva la cuenta de un usuario.

### 2. Comercial (Clientes y Ventas)
* `GET /customers`: Lista de clientes con saldos y líneas de crédito.
* `POST /customers`: Registro de un nuevo cliente.
* `GET /sales`: Listado de ventas y cotizaciones emitidas.
* `POST /sales`: Creación de una venta/factura con afectación automática de inventarios.
* `GET /sales/{id}/pdf`: Descarga el comprobante en formato PDF.

### 3. Abastecimiento (Proveedores y Compras)
* `GET /suppliers`: Catálogo de proveedores homologados.
* `POST /suppliers`: Alta de nuevo proveedor.
* `GET /purchases`: Listado de órdenes de compra.
* `POST /purchases`: Creación de una orden de compra.
* `PUT /purchases/{id}/receive`: Confirmación de recepción de mercadería y entrada al almacén.

### 4. Inventarios y Almacenes
* `GET /products`: Catálogo maestro de productos con precios y stock consolidado.
* `POST /products`: Registro de un nuevo producto con SKU único.
* `GET /inventory/warehouses`: Listado de almacenes disponibles.
* `POST /inventory/transfers`: Ejecución de transferencia entre almacenes con registro en Kardex.

### 5. Finanzas y Pagos
* `GET /payments`: Historial de cobros y pagos registrados.
* `POST /payments`: Registro de un nuevo cobro a cliente o pago a proveedor.

### 6. Repositorio Documental Cloud (Amazon S3)
* `GET /documents`: Listado de documentos indexados con metadatos y entidad relacionada.
* `POST /documents/upload`: Subida de archivo a Amazon S3 y registro de metadatos en PostgreSQL.
* `GET /documents/{id}/download`: Generación de Presigned URL para descarga segura desde S3.

### 7. Reportes y Auditoría
* `GET /reports/dashboard-kpis`: Resumen ejecutivo consolidado para el panel principal.
* `GET /reports/sales-by-month`: Métricas temporales de facturación.
* `GET /reports/inventory-valuation`: Valorización de existencias por almacén.
* `GET /admin/audit-logs`: Bitácora inmutable de eventos críticos del ERP.
