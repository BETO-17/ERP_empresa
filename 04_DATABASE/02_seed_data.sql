-- =============================================================================
-- ERP ENTERPRISECLOUD - DATOS INICIALES (SEEDS)
-- =============================================================================

-- 1. Roles
INSERT INTO roles (nombre, codigo, descripcion) VALUES
('Super Administrador', 'admin', 'Acceso total y configuración del ERP'),
('Ejecutivo Comercial', 'ventas', 'Cotizaciones, pedidos, facturación y clientes'),
('Especialista de Compras', 'compras', 'Proveedores, órdenes de compra y recepción'),
('Jefe de Almacén', 'almacen', 'Inventario, kardex, traslados y ajustes de stock'),
('Analista Financiero', 'finanzas', 'Cuentas por cobrar, cuentas por pagar y tesorería')
ON CONFLICT (codigo) DO NOTHING;

-- 2. Permisos
INSERT INTO permisos (modulo, accion, codigo, descripcion) VALUES
('dashboard', 'leer', 'dashboard:view', 'Visualizar indicadores y KPI generales'),
('comercial', 'crear', 'ventas:create', 'Registrar cotizaciones y ventas'),
('comercial', 'aprobar', 'ventas:approve', 'Aprobar cotizaciones y descuentos especiales'),
('compras', 'crear', 'compras:create', 'Generar solicitudes y órdenes de compra'),
('inventario', 'actualizar', 'inventario:update', 'Ajustar stock y realizar transferencias'),
('finanzas', 'crear', 'pagos:create', 'Registrar cobros y pagos bancarios'),
('documentos', 'subir', 'documentos:upload', 'Subir archivos al bucket Amazon S3'),
('administracion', 'gestionar', 'admin:manage', 'Gestión de usuarios y auditoría')
ON CONFLICT (codigo) DO NOTHING;

-- 3. Usuarios de prueba (Contraseña por defecto hasheada: Admin123*)
INSERT INTO usuarios (nombre, email, password_hash, rol_id, departamento, cargo, activo) VALUES
('Mathias Mendoza', 'admin@erpcloud.com', '$2b$12$K8y4rTqI1uEeVk9M7bMre.vV9Q.zY7sLz5V5V0Wp2uD7KqjL7c9Wa', 1, 'Dirección General', 'Director de TI', TRUE),
('Ana Lucía Torres', 'ventas@erpcloud.com', '$2b$12$K8y4rTqI1uEeVk9M7bMre.vV9Q.zY7sLz5V5V0Wp2uD7KqjL7c9Wa', 2, 'Comercial', 'Líder de Ventas', TRUE),
('Carlos Paredes', 'compras@erpcloud.com', '$2b$12$K8y4rTqI1uEeVk9M7bMre.vV9Q.zY7sLz5V5V0Wp2uD7KqjL7c9Wa', 3, 'Logística', 'Coordinador de Abastecimiento', TRUE),
('Diana Silva', 'almacen@erpcloud.com', '$2b$12$K8y4rTqI1uEeVk9M7bMre.vV9Q.zY7sLz5V5V0Wp2uD7KqjL7c9Wa', 4, 'Operaciones', 'Jefa de Almacén Central', TRUE),
('Eduardo Vega', 'finanzas@erpcloud.com', '$2b$12$K8y4rTqI1uEeVk9M7bMre.vV9Q.zY7sLz5V5V0Wp2uD7KqjL7c9Wa', 5, 'Contabilidad', 'Analista de Tesorería', TRUE)
ON CONFLICT (email) DO NOTHING;

-- 4. Categorías
INSERT INTO categorias (nombre, codigo, descripcion) VALUES
('Servidores y Cómputo', 'CAT-COMP', 'Equipos de cómputo empresarial y servidores en rack'),
('Conectividad y Redes', 'CAT-NET', 'Switches, routers administrables, cables estructurados'),
('Licenciamiento y Cloud', 'CAT-SOFT', 'Suscripciones y servicios de soporte AWS'),
('Periféricos y Accesorios', 'CAT-ACC', 'Monitores, teclados y accesorios de oficina')
ON CONFLICT (codigo) DO NOTHING;

-- 5. Almacenes
INSERT INTO almacenes (codigo, nombre, ubicacion, es_principal) VALUES
('ALM-01', 'Almacén Central Lima', 'Av. Argentina 2840, Callao - Lima', TRUE),
('ALM-02', 'Almacén Secundario Arequipa', 'Parque Industrial Mz. C Lote 4, Arequipa', FALSE)
ON CONFLICT (codigo) DO NOTHING;

-- 6. Productos
INSERT INTO productos (sku, nombre, categoria_id, precio_compra, precio_venta, stock_minimo, unidad_medida) VALUES
('SRV-DELL-R750', 'Servidor Dell PowerEdge R750 2U Rack', 1, 14200.00, 18900.00, 2, 'UND'),
('SW-CISCO-C9200', 'Switch Cisco Catalyst 9200L 48 Puertos PoE+', 2, 6800.00, 8950.00, 3, 'UND'),
('UPS-APC-3KVA', 'Sistema UPS APC Smart-UPS RT 3000VA On-Line', 1, 4100.00, 5450.00, 2, 'UND'),
('RACK-42U-PRO', 'Gabinete Servidores 42U Estándar ANSI/TIA', 2, 2200.00, 3100.00, 4, 'UND'),
('LIC-AWS-ENTERPRISE', 'Suscripción Anual Soporte Enterprise Cloud', 3, 12000.00, 15500.00, 1, 'UND')
ON CONFLICT (sku) DO NOTHING;

-- 7. Clientes
INSERT INTO clientes (tipo_documento, numero_documento, razon_social, nombre_comercial, email, telefono, direccion, limite_credito, saldo_pendiente) VALUES
('RUC', '20601234567', 'Inversiones Tecnológicas del Pacífico S.A.C.', 'TecnoPacífico', 'contacto@tecnopacifico.pe', '+51 1 614-8800', 'Av. Canaval y Moreyra 480, San Isidro, Lima', 50000.00, 12500.00),
('RUC', '20519876543', 'Corporación Minera Andina S.A.', 'Minera Andina', 'compras@mineraandina.com', '+51 1 513-9000', 'Av. Javier Prado Este 444, San Borja, Lima', 120000.00, 34200.00),
('RUC', '20498765432', 'Distribuidora Retail del Sur S.R.L.', 'Retail Sur', 'logistica@retailsur.pe', '+51 54 223344', 'Av. Parra 120, Arequipa', 30000.00, 0.00)
ON CONFLICT (numero_documento) DO NOTHING;

-- 8. Proveedores
INSERT INTO proveedores (tipo_documento, numero_documento, razon_social, contacto_nombre, email, telefono, direccion, dias_credito, saldo_por_pagar) VALUES
('RUC', '20100128456', 'Mayorista Global de Tecnología Perú S.A.', 'Roberto Mendoza', 'ventas@globaltech.com.pe', '+51 1 411-2000', 'Av. Elmer Faucett 1520, Callao', 45, 18900.00),
('RUC', '20258963147', 'Sistemas y Cableado de Redes S.A.C.', 'Mariana Ruiz', 'mruiz@redesperu.com', '+51 1 315-7788', 'Calle Los Jazmines 340, Lince', 30, 6800.00)
ON CONFLICT (numero_documento) DO NOTHING;

-- 9. Stock inicial en inventarios
INSERT INTO inventarios (producto_id, almacen_id, stock_actual, stock_comprometido) VALUES
(1, 1, 5, 1),
(2, 1, 12, 2),
(3, 1, 8, 0),
(4, 1, 15, 0),
(5, 1, 50, 0)
ON CONFLICT (producto_id, almacen_id) DO NOTHING;
