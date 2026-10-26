# 07. SEGURIDAD, CONTROL DE ACCESO (RBAC) Y AUDITORÍA
## ERP EnterpriseCloud

---

## 1. Modelo de Autorización (RBAC)

El acceso al sistema se rige por el principio de privilegio mínimo mediante 5 roles funcionales:

```text
                  ┌──────────────┐
                  │ Super Admin  │ ── Acceso Total a todos los módulos y auditoría
                  └──────┬───────┘
         ┌───────────────┼───────────────┬────────────────┐
         ▼               ▼               ▼                ▼
   ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌─────────────┐
   │  Ventas   │   │  Compras  │   │  Almacén  │   │  Finanzas   │
   └───────────┘   └───────────┘   └───────────┘   └─────────────┘
   - Clientes      - Proveedores   - Productos     - CxC y CxP
   - Cotizaciones  - Solicitudes   - Almacenes     - Caja y Bancos
   - Pedidos       - Órdenes       - Stock         - Cobros/Pagos
   - Facturas      - Recepción     - Kardex        - Flujo Caja
```

---

## 2. Flujo de Autenticación y Token JWT (Sección 18)

1. El usuario envía credenciales (`email` y `password`) mediante HTTPS.
2. El backend verifica la existencia del usuario y valida el hash Bcrypt.
3. Se genera un JSON Web Token (JWT) firmado con algoritmo HS256 y secreto seguro, conteniendo:
   * `sub`: ID del usuario
   * `email`: Correo electrónico
   * `role`: Código del rol asignado (`admin`, `ventas`, etc.)
   * `exp`: Timestamp de expiración (8 horas estándar)
4. El frontend guarda el token en memoria de sesión (`sessionStorage`) y lo adjunta en cada petición mediante el encabezado `Authorization: Bearer <token>`.

---

## 3. Modelo de Auditoría Inmutable (Sección 20)

Toda operación que cree, modifique o anule información empresarial sensible genera un registro automático en la tabla `auditoria` con los siguientes campos:

* **USUARIO:** ID y nombre del operador.
* **ACCIÓN:** Operación ejecutada (`LOGIN`, `CREAR_VENTA`, `MODIFICAR_STOCK`, `SUBIR_DOCUMENTO`, `ANULAR_PAGO`).
* **MÓDULO:** Dominio afectado (`VENTAS`, `INVENTARIO`, `DOCUMENTOS`, etc.).
* **REGISTRO AFECTADO:** Identificador único del registro de negocio (ej. `VNT-2026-001`).
* **FECHA / HORA:** Marca temporal UTC de base de datos.
* **RESULTADO:** `EXITOSO`, `FALLIDO` o `DENEGADO`.
