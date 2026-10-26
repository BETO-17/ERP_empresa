# 05_AWS — Arquitectura Cloud con AWS (Semana 07)
## Sistema de Gestión Empresarial ERP EnterpriseCloud

> **Objetivo Curricular Semana 07:** Implementa servicios en la nube con énfasis en computación (Amazon EC2), almacenamiento (Amazon S3 / EBS / EFS) y bases de datos relacionales administradas (Amazon RDS PostgreSQL).

---

## 🏛️ 1. Diagrama de Arquitectura Cloud (Sección 16 y 21)

```mermaid
flowchart TD
    subgraph CLIENTES["Usuarios Corporativos / Internet"]
        U1["Navegador Web (Laptop / PC)"]
        U2["Dispositivo Móvil"]
    end

    subgraph AWS_CLOUD["Amazon Web Services (AWS)"]
        subgraph EDGE["Distribución y Frontend"]
            CF["Amazon CloudFront / S3 Static Web Hosting"]
            REACT["Frontend React + TypeScript"]
            CF --> REACT
        end

        subgraph VPC["Amazon Virtual Private Cloud (VPC)"]
            ALB["Application Load Balancer (ALB / Public Subnet)"]

            subgraph ASG["Auto Scaling Group / EC2 (Private Subnets)"]
                EC2_1["Amazon EC2 - Instancia 1\n(FastAPI + Uvicorn)"]
                EC2_2["Amazon EC2 - Instancia 2\n(FastAPI + Uvicorn)"]
                EC2_3["Amazon EC2 - Instancia 3\n(FastAPI + Uvicorn)"]
            end

            subgraph DB_LAYER["Base de Datos Administrada (Private Data Subnet)"]
                RDS["Amazon RDS PostgreSQL 16\n(Multi-AZ Master + Standby)"]
            end

            subgraph STORAGE_LAYER["Almacenamiento de Archivos"]
                EBS["Amazon EBS\n(Volumen de Sistema)"]
                EFS["Amazon EFS\n(Archivos Compartidos)"]
            end
        end

        subgraph OBJECT_STORAGE["Almacenamiento de Objetos"]
            S3["Amazon S3 Bucket\n(Facturas, Contratos, Comprobantes PDF)"]
        end

        subgraph MONITORING["Monitoreo y Auditoría"]
            CW["Amazon CloudWatch\n(Métricas CPU, Logs API, Alarmas)"]
        end
    end

    U1 --> CF
    U2 --> CF
    REACT -->|API REST / JSON| ALB
    ALB --> EC2_1
    ALB --> EC2_2
    ALB --> EC2_3
    EC2_1 --> RDS
    EC2_2 --> RDS
    EC2_3 --> RDS
    EC2_1 -->|Boto3 / Presigned URLs| S3
    EC2_2 -->|Boto3 / Presigned URLs| S3
    EC2_3 -->|Boto3 / Presigned URLs| S3
    EC2_1 -.-> CW
    RDS -.-> CW
```

---

## ☁️ 2. Mapeo de Servicios de la Semana 07

| Servicio AWS | Categoría | Función en el ERP EnterpriseCloud |
| :--- | :--- | :--- |
| **Amazon EC2** | Cómputo | Ejecución escalable del backend FastAPI en instancias Ubuntu Linux. |
| **Application Load Balancer (ALB)** | Red y Escalabilidad | Distribución de carga equitativa entre múltiples instancias EC2 (`EC2-1`, `EC2-2`, `EC2-3`). |
| **Amazon S3** | Almacenamiento de Objetos | Repositorio seguro para facturas, cotizaciones, órdenes de compra y documentos PDF. |
| **Amazon EBS** | Almacenamiento de Bloques | Disco de alto rendimiento (SSD gp3) montado para el sistema operativo en cada EC2. |
| **Amazon EFS** | Sistema de Archivos | File system compartido para subprocesos batch cuando se requiera. |
| **Amazon RDS (PostgreSQL)** | Base de Datos Relacional | Motor PostgreSQL 16 administrado con copias de seguridad automáticas y alta disponibilidad. |
| **Amazon CloudWatch** | Monitoreo y Observabilidad | Centralización de logs de la aplicación, métricas de CPU/RAM y alertas de salud. |
