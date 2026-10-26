# ERP ENTERPRISECLOUD
## Sistema Integrado de Gestión Empresarial basado en Cloud Computing

> **Base Académica:** Semana 07 — Tecnología Cloud con AWS: *"Implementa servicios en la nube"*, con énfasis en computación (Amazon EC2 / ALB), almacenamiento (Amazon S3 / EBS / EFS) y bases de datos relacionales (Amazon RDS con PostgreSQL).  
> **Versión:** 1.0 | 2026 | Documento Maestro del Sistema Empresarial.

---

## 📁 Estructura de Entregables del Proyecto (Sección 26 del Documento Maestro)

El repositorio está estructurado estrictamente según los 8 paquetes de entregables establecidos en el Documento Maestro:

```text
ERP_empresa/
├── 01_DOCUMENTACION/       # Especificaciones de Requerimientos, Casos de Uso, Procesos, Arquitectura, BD, API, AWS y Pruebas
│   ├── Requerimientos/     # SRS: Requisitos funcionales (RF-01 a RF-10) y no funcionales
│   ├── Casos_de_uso/       # Diagramas y especificación de casos de uso por dominio
│   ├── Procesos/           # Mapa y flujos de negocio (Ventas, Compras, Finanzas, Kardex)
│   ├── Arquitectura/       # Arquitectura del sistema, capas y componentes
│   ├── Base_de_datos/      # Diccionario de datos y modelo de las 17 tablas relacionales
│   ├── API/                # Contrato y especificación técnica de la API REST (FastAPI)
│   ├── Seguridad/          # Modelo RBAC, políticas JWT y trazabilidad de auditoría
│   ├── Infraestructura/    # Diseño de infraestructura AWS (Semana 07)
│   ├── Pruebas/            # Estrategia y matriz de pruebas
│   └── Manuales/           # Estructura documental y control de versiones
├── 02_FRONTEND/            # Módulo de interfaz de usuario (React 19 + TypeScript + Vite)
├── 03_BACKEND/             # API REST empresarial (Python 3.11+ + FastAPI + SQLAlchemy)
├── 04_DATABASE/            # Scripts DDL PostgreSQL (17 tablas), semillas (seeds) y diagrama ER
├── 05_AWS/                 # Infraestructura como código (Terraform), políticas S3, configs EC2 y RDS
├── 06_TESTING/             # Planes de prueba, suites de test backend/frontend y rendimiento
├── 07_DEPLOYMENT/          # Docker Compose, Dockerfiles multi-stage y pipelines CI/CD
├── 08_MANUALES/            # Manual de usuario final y Manual técnico de despliegue
└── aws-cloud/              # Código fuente activo del Frontend en desarrollo
```

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Función |
| :--- | :--- | :--- |
| **Frontend** | React 19 + TypeScript + Vite | Interfaz de usuario modular, accesible, responsive con navegación por roles. |
| **Backend** | Python 3.11+ + FastAPI | API REST empresarial con Pydantic, SQLAlchemy y autenticación JWT. |
| **Base de Datos** | PostgreSQL 16 (Amazon RDS) | Base de datos relacional normalizada con 17 entidades y control transaccional. |
| **Almacenamiento Cloud** | Amazon S3 | Repositorio de objetos empresariales (facturas, contratos, comprobantes PDF). |
| **Cómputo Cloud** | Amazon EC2 + ALB | Despliegue del backend con escalabilidad horizontal detrás de un Application Load Balancer. |
| **Monitoreo** | Amazon CloudWatch | Registro centralizado de logs, alarmas de CPU/memoria y latencia de endpoints. |

---

## 🚀 Guía Rápida de Ejecución Local

### 1. Frontend (React + TypeScript)
```bash
cd aws-cloud
npm install
npm run dev
```
La aplicación iniciará en `http://localhost:5173`. Por defecto viene configurada para demostración completa en modo interactivo.

### 2. Backend (FastAPI)
```bash
cd 03_BACKEND
python -m venv venv
# En Windows:
.\venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
La documentación interactiva Swagger estará disponible en `http://localhost:8000/docs`.

### 3. Base de Datos (PostgreSQL)
Ejecutar los scripts ubicados en `04_DATABASE/`:
1. `01_schema_postgresql.sql` (crea las 17 tablas con índices y relaciones).
2. `02_seed_data.sql` (inserta usuarios base, roles, almacenes y catálogo inicial).

### 4. Despliegue con Docker Compose (Pila Completa)
```bash
cd 07_DEPLOYMENT
docker-compose up -d
```
Levanta simultáneamente: PostgreSQL, Backend FastAPI, Frontend React y LocalStack (simulador de Amazon S3).
