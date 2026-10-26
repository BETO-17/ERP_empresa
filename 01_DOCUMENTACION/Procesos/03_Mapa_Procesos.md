# 03. MAPA Y FLUJOGRAMAS DE PROCESOS EMPRESARIALES
## ERP EnterpriseCloud

---

## 1. Ciclo de Ventas (Order-to-Cash)

```mermaid
sequenceDiagram
    autonumber
    actor Cliente
    actor Vendedor
    participant ERP_Frontend as Frontend (React)
    participant ERP_Backend as Backend (FastAPI)
    participant Database as PostgreSQL (RDS)
    participant Cloud_S3 as Amazon S3

    Vendedor->>ERP_Frontend: Registrar Cotización o Pedido
    ERP_Frontend->>ERP_Backend: POST /api/v1/sales
    ERP_Backend->>Database: Validar stock y registrar venta
    ERP_Backend->>Database: Descontar stock y registrar Kardex
    ERP_Backend->>Cloud_S3: Guardar copia PDF de factura electrónica
    ERP_Backend-->>ERP_Frontend: Retornar comprobante emitido
    Vendedor->>Cliente: Entregar comprobante y producto
```

---

## 2. Ciclo de Compras (Procure-to-Pay)

```mermaid
sequenceDiagram
    autonumber
    actor Comprador
    actor Proveedor
    participant ERP_Frontend as Frontend (React)
    participant ERP_Backend as Backend (FastAPI)
    participant Database as PostgreSQL (RDS)

    Comprador->>ERP_Frontend: Crear Orden de Compra
    ERP_Frontend->>ERP_Backend: POST /api/v1/purchases
    ERP_Backend->>Database: Guardar orden en estado 'EMITIDA'
    Proveedor-->>Comprador: Entrega física de mercadería y factura
    Comprador->>ERP_Frontend: Confirmar Recepción en Almacén
    ERP_Frontend->>ERP_Backend: PUT /api/v1/purchases/{id}/receive
    ERP_Backend->>Database: Incrementar stock en almacén destino
    ERP_Backend->>Database: Registrar movimiento de Kardex (ENTRADA)
    ERP_Backend->>Database: Registrar cuenta por pagar (CxP)
    ERP_Backend-->>ERP_Frontend: Estado actualizado a 'RECIBIDO'
```

---

## 3. Flujo del Repositorio Documental Cloud (Amazon S3)

```mermaid
sequenceDiagram
    autonumber
    actor Usuario
    participant Frontend as React App
    participant Backend as FastAPI
    participant S3 as Amazon S3 Bucket
    participant RDS as PostgreSQL

    Usuario->>Frontend: Selecciona archivo (factura / contrato .pdf)
    Frontend->>Backend: Solicita Presigned URL / Envía archivo multipart
    Backend->>S3: PutObject (Almacena archivo físico)
    Backend->>RDS: INSERT INTO documentos (uuid, s3_bucket, s3_key, metadatos)
    Backend-->>Frontend: Confirmación de subida exitosa
    Usuario->>Frontend: Clic en "Descargar / Previsualizar"
    Frontend->>Backend: GET /api/v1/documents/{id}/download
    Backend->>S3: GeneratePresignedUrl (Lectura con vencimiento)
    Backend-->>Frontend: Redirecciona al enlace seguro de S3
```
