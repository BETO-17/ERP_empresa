# 04. ARQUITECTURA DEL SISTEMA Y TECNOLOGÍAS
## ERP EnterpriseCloud

---

## 1. Visión General de la Arquitectura (Sección 9 del Documento Maestro)

El sistema adopta una arquitectura en capas desacoplada basada en microservicios modulares para la API y cliente rico en el navegador:

```text
  [ USUARIOS EN NAVEGADOR WEB ]
               │
               ▼  (HTTPS / TLS 1.3)
  [ CAPA DE PRESENTACIÓN: REACT + TYPESCRIPT ]
     - Router y Control de Acceso por Roles (RBAC)
     - Gestión de Estado (AuthContext, ToastContext)
     - Interfaz Modular (11 Dominios de Negocio)
               │
               ▼  (REST API / JSON / Bearer JWT)
  [ CAPA DE SERVICIOS: PYTHON / FASTAPI ]
     - Controladores y Endpoints (/api/v1/*)
     - Validación con Pydantic Schemas
     - Lógica de Negocio y Reglas Transaccionales
     - Capa de Seguridad (Bcrypt, JWT)
               │
        ┌──────┴──────────────────────────┐
        ▼                                 ▼
[ CAPA DE PERSISTENCIA ]       [ ALMACENAMIENTO DE OBJETOS ]
Amazon RDS (PostgreSQL 16)      Amazon S3 (Buckets de Documentos)
- 17 tablas relacionales       - Facturas electrónicas en PDF
- Integridad referencial       - Contratos y órdenes escaneadas
- Bitácora de auditoría        - URLs prefirmadas seguras
```

---

## 2. Principios de Diseño
1. **Desacoplamiento Frontend/Backend:** La interfaz no contiene reglas de negocio ni credenciales de base de datos; consume estrictamente contratos REST tipados.
2. **Separación de Datos y Archivos:** Los metadatos de las operaciones residen en PostgreSQL, mientras que los archivos pesados (PDFs, imágenes) residen en Amazon S3.
3. **Escalabilidad Horizontal:** El backend es stateless, lo que permite agregar múltiples instancias EC2 detrás de un Application Load Balancer sin pérdida de sesiones.
4. **Seguridad en Profundidad:** Autenticación por tokens JWT, control de acceso basado en roles (RBAC) en backend y frontend, y registro inmutable de auditoría.
