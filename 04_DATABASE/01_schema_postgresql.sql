-- =============================================================================
-- ERP ENTERPRISECLOUD - ESQUEMA DE BASE DE DATOS RELACIONAL
-- Base Académica: Semana 07 - Tecnología Cloud con AWS (Amazon RDS PostgreSQL)
-- Versión: 1.0 | 2026
-- Entidades: 17 tablas normalizadas según Documento Maestro (Sección 13)
-- =============================================================================

-- Extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. SEGURIDAD, ACCESO Y ADMINISTRACIÓN
-- =============================================================================

-- Tabla de Roles
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    codigo VARCHAR(30) NOT NULL UNIQUE, -- 'admin', 'ventas', 'compras', 'almacen', 'finanzas'
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Permisos
CREATE TABLE IF NOT EXISTS permisos (
    id SERIAL PRIMARY KEY,
    modulo VARCHAR(50) NOT NULL,
    accion VARCHAR(50) NOT NULL, -- 'crear', 'leer', 'actualizar', 'eliminar', 'aprobar'
    codigo VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Intermedia Rol-Permiso
CREATE TABLE IF NOT EXISTS roles_permisos (
    rol_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permiso_id INT NOT NULL REFERENCES permisos(id) ON DELETE CASCADE,
    PRIMARY KEY (rol_id, permiso_id)
);

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL REFERENCES roles(id),
    departamento VARCHAR(80),
    cargo VARCHAR(80),
    activo BOOLEAN DEFAULT TRUE,
    ultimo_acceso TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Auditoría
CREATE TABLE IF NOT EXISTS auditoria (
    id BIGSERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    usuario_nombre VARCHAR(120),
    accion VARCHAR(50) NOT NULL,     -- 'LOGIN', 'CREAR', 'ACTUALIZAR', 'ELIMINAR', 'DESCARGAR'
    modulo VARCHAR(60) NOT NULL,     -- 'VENTAS', 'COMPRAS', 'INVENTARIO', 'DOCUMENTOS', 'SEGURIDAD'
    registro_afectado VARCHAR(100),  -- 'VNT-2026-001', 'PROD-014', etc.
    ip_origen VARCHAR(45),
    user_agent TEXT,
    detalles JSONB,                  -- Valores antes y después
    resultado VARCHAR(20) DEFAULT 'EXITOSO', -- 'EXITOSO', 'FALLIDO', 'DENEGADO'
    fecha_hora TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 2. CLIENTES Y PROVEEDORES
-- =============================================================================

-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    tipo_documento VARCHAR(20) DEFAULT 'RUC', -- 'RUC', 'DNI', 'CE', 'PASAPORTE'
    numero_documento VARCHAR(30) NOT NULL UNIQUE,
    razon_social VARCHAR(200) NOT NULL,
    nombre_comercial VARCHAR(200),
    email VARCHAR(150),
    telefono VARCHAR(30),
    direccion TEXT,
    ciudad VARCHAR(100),
    pais VARCHAR(60) DEFAULT 'Perú',
    limite_credito NUMERIC(14, 2) DEFAULT 0.00,
    saldo_pendiente NUMERIC(14, 2) DEFAULT 0.00,
    estado VARCHAR(30) DEFAULT 'ACTIVO', -- 'ACTIVO', 'INACTIVO', 'MOROSO'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Proveedores
CREATE TABLE IF NOT EXISTS proveedores (
    id SERIAL PRIMARY KEY,
    tipo_documento VARCHAR(20) DEFAULT 'RUC',
    numero_documento VARCHAR(30) NOT NULL UNIQUE,
    razon_social VARCHAR(200) NOT NULL,
    contacto_nombre VARCHAR(120),
    email VARCHAR(150),
    telefono VARCHAR(30),
    direccion TEXT,
    dias_credito INT DEFAULT 30,
    saldo_por_pagar NUMERIC(14, 2) DEFAULT 0.00,
    estado VARCHAR(30) DEFAULT 'ACTIVO',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 3. CATÁLOGO, ALMACENES E INVENTARIO
-- =============================================================================

-- Categorías de Productos
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Almacenes Físicos / Lógicos
CREATE TABLE IF NOT EXISTS almacenes (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(120) NOT NULL,
    ubicacion TEXT,
    responsable_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    es_principal BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Catálogo de Productos y Servicios
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria_id INT REFERENCES categorias(id),
    precio_compra NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    precio_venta NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    stock_minimo INT DEFAULT 5,
    unidad_medida VARCHAR(20) DEFAULT 'UND', -- 'UND', 'KG', 'MTR', 'LITRO'
    estado VARCHAR(30) DEFAULT 'ACTIVO',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Existencias por Almacén (Inventarios)
CREATE TABLE IF NOT EXISTS inventarios (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    almacen_id INT NOT NULL REFERENCES almacenes(id) ON DELETE CASCADE,
    stock_actual INT NOT NULL DEFAULT 0,
    stock_comprometido INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_producto_almacen UNIQUE (producto_id, almacen_id)
);

-- Movimientos de Inventario (Kardex físico-valorizado)
CREATE TABLE IF NOT EXISTS movimientos_inventario (
    id BIGSERIAL PRIMARY KEY,
    tipo_movimiento VARCHAR(30) NOT NULL, -- 'ENTRADA', 'SALIDA', 'TRANSFERENCIA', 'AJUSTE'
    producto_id INT NOT NULL REFERENCES productos(id),
    almacen_origen_id INT REFERENCES almacenes(id),
    almacen_destino_id INT REFERENCES almacenes(id),
    cantidad INT NOT NULL,
    costo_unitario NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    saldo_anterior INT NOT NULL,
    saldo_posterior INT NOT NULL,
    motivo VARCHAR(150),
    referencia_operacion VARCHAR(100), -- 'COMPRA CMP-2026-001', 'VENTA VNT-2026-003'
    usuario_id INT REFERENCES usuarios(id),
    fecha_hora TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 4. PROCESO COMERCIAL (VENTAS)
-- =============================================================================

CREATE TABLE IF NOT EXISTS ventas (
    id SERIAL PRIMARY KEY,
    codigo_venta VARCHAR(50) NOT NULL UNIQUE, -- 'VNT-2026-001'
    cliente_id INT NOT NULL REFERENCES clientes(id),
    usuario_id INT NOT NULL REFERENCES usuarios(id),
    tipo_comprobante VARCHAR(30) DEFAULT 'FACTURA', -- 'FACTURA', 'BOLETA', 'COTIZACION', 'PEDIDO'
    serie_correlativo VARCHAR(50),
    fecha_emision DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_vencimiento DATE,
    moneda VARCHAR(10) DEFAULT 'PEN', -- 'PEN', 'USD'
    subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    igv NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    estado VARCHAR(30) DEFAULT 'EMITIDA', -- 'COTIZACION', 'PEDIDO', 'EMITIDA', 'PAGADA', 'ANULADA'
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS detalle_ventas (
    id SERIAL PRIMARY KEY,
    venta_id INT NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
    producto_id INT NOT NULL REFERENCES productos(id),
    almacen_id INT REFERENCES almacenes(id),
    cantidad INT NOT NULL,
    precio_unitario NUMERIC(14, 2) NOT NULL,
    descuento NUMERIC(14, 2) DEFAULT 0.00,
    subtotal NUMERIC(14, 2) NOT NULL
);

-- =============================================================================
-- 5. PROCESO DE ABASTECIMIENTO (COMPRAS)
-- =============================================================================

CREATE TABLE IF NOT EXISTS compras (
    id SERIAL PRIMARY KEY,
    codigo_compra VARCHAR(50) NOT NULL UNIQUE, -- 'CMP-2026-001'
    proveedor_id INT NOT NULL REFERENCES proveedores(id),
    usuario_id INT NOT NULL REFERENCES usuarios(id),
    numero_factura_proveedor VARCHAR(60),
    fecha_emision DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_recepcion DATE,
    moneda VARCHAR(10) DEFAULT 'PEN',
    subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    igv NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    estado VARCHAR(30) DEFAULT 'RECIBIDO', -- 'SOLICITUD', 'ORDEN_COMPRA', 'RECIBIDO', 'PAGADO', 'ANULADO'
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS detalle_compras (
    id SERIAL PRIMARY KEY,
    compra_id INT NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
    producto_id INT NOT NULL REFERENCES productos(id),
    almacen_id INT REFERENCES almacenes(id),
    cantidad INT NOT NULL,
    precio_unitario NUMERIC(14, 2) NOT NULL,
    subtotal NUMERIC(14, 2) NOT NULL
);

-- =============================================================================
-- 6. FINANZAS Y GESTIÓN DE PAGOS
-- =============================================================================

CREATE TABLE IF NOT EXISTS pagos (
    id SERIAL PRIMARY KEY,
    codigo_pago VARCHAR(50) NOT NULL UNIQUE, -- 'PAG-2026-001'
    tipo_operacion VARCHAR(30) NOT NULL,     -- 'COBRO_CLIENTE', 'PAGO_PROVEEDOR'
    venta_id INT REFERENCES ventas(id) ON DELETE SET NULL,
    compra_id INT REFERENCES compras(id) ON DELETE SET NULL,
    cliente_id INT REFERENCES clientes(id) ON DELETE SET NULL,
    proveedor_id INT REFERENCES proveedores(id) ON DELETE SET NULL,
    monto NUMERIC(14, 2) NOT NULL,
    moneda VARCHAR(10) DEFAULT 'PEN',
    metodo_pago VARCHAR(50) NOT NULL,        -- 'TRANSFERENCIA', 'EFECTIVO', 'CHEQUE', 'TARJETA'
    banco VARCHAR(80),
    numero_operacion VARCHAR(80),
    fecha_pago DATE NOT NULL DEFAULT CURRENT_DATE,
    registrado_por INT REFERENCES usuarios(id),
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 7. REPOSITORIO DOCUMENTAL CLOUD (VINCULACIÓN AMAZON S3)
-- =============================================================================

CREATE TABLE IF NOT EXISTS documentos (
    id SERIAL PRIMARY KEY,
    uuid_documento UUID DEFAULT uuid_generate_v4() UNIQUE,
    nombre_archivo VARCHAR(255) NOT NULL,
    tipo_documento VARCHAR(50) NOT NULL,     -- 'factura', 'contrato', 'orden_compra', 'guia_remision', 'comprobante'
    s3_bucket VARCHAR(120) NOT NULL,        -- Nombre del bucket Amazon S3
    s3_key VARCHAR(500) NOT NULL,           -- Ruta del objeto en S3: docs/2026/02/factura_001.pdf
    s3_url TEXT,                            -- Presigned URL o endpoint de descarga
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    tamano_bytes BIGINT NOT NULL,
    entidad_relacionada VARCHAR(100),       -- 'Venta VNT-2026-001', 'Proveedor RUC 20556677889'
    subido_por_usuario_id INT REFERENCES usuarios(id),
    checksum_md5 VARCHAR(64),
    estado VARCHAR(30) DEFAULT 'ACTIVO',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- ÍNDICES DE RENDIMIENTO (Optimización para AWS RDS PostgreSQL)
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON auditoria(usuario_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_fecha ON auditoria(fecha_hora DESC);
CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos(sku);
CREATE INDEX IF NOT EXISTS idx_inventarios_producto ON inventarios(producto_id);
CREATE INDEX IF NOT EXISTS idx_mov_inv_producto ON movimientos_inventario(producto_id);
CREATE INDEX IF NOT EXISTS idx_ventas_codigo ON ventas(codigo_venta);
CREATE INDEX IF NOT EXISTS idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_compras_codigo ON compras(codigo_compra);
CREATE INDEX IF NOT EXISTS idx_documentos_uuid ON documentos(uuid_documento);
CREATE INDEX IF NOT EXISTS idx_documentos_entidad ON documentos(entidad_relacionada);
