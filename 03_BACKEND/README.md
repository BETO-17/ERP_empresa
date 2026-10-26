# 03_BACKEND — ERP EnterpriseCloud API (FastAPI + Python)

API REST empresarial construida con **FastAPI**, **SQLAlchemy** y **Pydantic**, diseñada para operar sobre **Amazon EC2**, conectarse a **Amazon RDS PostgreSQL** y gestionar almacenamiento de documentos en **Amazon S3**, cumpliendo los requerimientos de la **Semana 07: Tecnología Cloud con AWS**.

---

## 🏛️ Estructura del Backend (Sección 15 del Documento Maestro)

```text
backend/
├── app/
│   ├── api/             # Rutas y controladores REST (v1)
│   ├── core/            # Configuración, variables y conexión a BD
│   ├── models/          # Entidades ORM (17 tablas PostgreSQL)
│   ├── schemas/         # Esquemas de validación Pydantic
│   ├── services/        # Servicios de negocio y cliente AWS Boto3
│   ├── repositories/    # Capa de persistencia y consultas SQL
│   ├── security/        # Hashing bcrypt, tokens JWT y guards RBAC
│   └── main.py          # Punto de entrada de la aplicación FastAPI
├── tests/               # Pruebas automatizadas con Pytest
├── requirements.txt     # Dependencias del proyecto
└── .env.example         # Plantilla de variables de entorno
```

---

## 📡 Endpoints Implementados (Sección 15)

| Ruta | Responsabilidad |
| :--- | :--- |
| `/api/v1/auth` | Autenticación, generación y renovación de tokens JWT |
| `/api/v1/users` | Gestión de usuarios y asignación de roles |
| `/api/v1/customers` | Cartera de clientes y líneas de crédito |
| `/api/v1/suppliers` | Homologación y control de proveedores |
| `/api/v1/products` | Catálogo de productos, SKU y categorías |
| `/api/v1/inventory` | Stock por almacén, transferencias y Kardex |
| `/api/v1/sales` | Cotizaciones, pedidos y facturas de venta |
| `/api/v1/purchases` | Solicitudes, órdenes de compra y recepción |
| `/api/v1/payments` | Control de cuentas por cobrar, pagar y caja/bancos |
| `/api/v1/documents` | Gestión documental con subida y descarga en Amazon S3 |
| `/api/v1/reports` | Resumen ejecutivo, KPI comerciales e indicadores |

---

## 🚀 Puesta en Marcha Local

```bash
# 1. Crear entorno virtual
python -m venv venv

# 2. Activar entorno virtual
# En Windows:
.\venv\Scripts\activate
# En Linux/macOS:
source venv/bin/activate

# 3. Instalar librerías
pip install -r requirements.txt

# 4. Iniciar servidor de desarrollo
uvicorn app.main:app --reload --port 8000
```

Acceso a la documentación interactiva OpenAPI:
* **Swagger UI:** `http://localhost:8000/api/v1/docs`
* **ReDoc:** `http://localhost:8000/api/v1/redoc`
