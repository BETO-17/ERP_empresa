# 01. MANUAL DE USUARIO
## ERP EnterpriseCloud — Sistema de Gestión Empresarial en Cloud

---

## 1. Acceso a la Plataforma
1. Abrir el navegador e ingresar a la URL del ERP (ejemplo local: `http://localhost:5173/login`).
2. Introducir correo corporativo y contraseña:
   * **Administrador:** `admin@erpcloud.com` / `Admin123*`
   * **Ventas:** `ventas@erpcloud.com` / `Admin123*`
   * **Compras:** `compras@erpcloud.com` / `Admin123*`
   * **Almacén:** `almacen@erpcloud.com` / `Admin123*`
   * **Finanzas:** `finanzas@erpcloud.com` / `Admin123*`
3. Hacer clic en **"Iniciar Sesión"**.

---

## 2. Navegación por Módulos
* **Dashboard:** Vista panorámica con tarjetas de KPI, gráficos de facturación, estado financiero y productos con bajo stock.
* **Clientes y Ventas:** 
  * Registrar nuevos clientes con RUC o DNI.
  * Emitir cotizaciones y convertirlas en órdenes o facturas.
  * Descargar e imprimir comprobantes de venta en formato PDF con membrete corporativo y código QR.
* **Proveedores y Compras:**
  * Administrar directorio de proveedores.
  * Generar órdenes de compra y recepcionar mercancía en almacén para alimentar el inventario.
* **Inventario y Almacenes:**
  * Consultar existencias en tiempo real por sede.
  * Realizar traslados entre el Almacén Central y almacenes sucursales.
  * Revisar el Kardex valorizado con fecha y responsable.
* **Finanzas:**
  * Control de cuentas por cobrar (facturas pendientes de clientes).
  * Control de cuentas por pagar a proveedores.
  * Registro de cobros y pagos bancarios o en efectivo.
* **Documentos (Amazon S3):**
  * Subida de contratos, actas, comprobantes y facturas en formato digital.
  * Descarga segura y previsualización en visor integrado.
* **Administración (Sólo rol Admin):**
  * Alta de usuarios y asignación de roles.
  * Bitácora inmutable de auditoría con fecha, hora, usuario y acción.
