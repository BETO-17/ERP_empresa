# 02. MANUAL TÉCNICO Y GUÍA DE DESPLIEGUE EN AWS
## ERP EnterpriseCloud — Semana 07: Tecnología Cloud con AWS

---

## 1. Requisitos Previos
* Cuenta de AWS activa con usuario IAM y permisos para EC2, RDS, S3 y CloudWatch.
* AWS CLI configurado (`aws configure`).
* Docker y Docker Compose instalados (para ejecución local o en contenedor).
* Node.js 20+ y Python 3.11+.

---

## 2. Configuración de Servicios AWS (Semana 07)

### A. Repositorio de Documentos en Amazon S3
1. Crear el bucket en la región deseada:
   ```bash
   aws s3api create-bucket --bucket erp-enterprisecloud-documents-2026 --region us-east-1
   ```
2. Aplicar la política de CORS ubicada en `05_AWS/s3/cors_policy.json`:
   ```bash
   aws s3api put-bucket-cors --bucket erp-enterprisecloud-documents-2026 --cors-configuration file://05_AWS/s3/cors_policy.json
   ```

### B. Base de Datos en Amazon RDS (PostgreSQL)
1. Crear una instancia de base de datos RDS PostgreSQL (versión 16) con clase `db.t3.micro` o `db.t4g.micro` en subredes privadas.
2. Habilitar el grupo de seguridad para permitir tráfico en el puerto `5432` únicamente desde el grupo de seguridad de las instancias EC2.
3. Conectarse y ejecutar los scripts:
   ```bash
   psql -h <RDS_ENDPOINT> -U postgres -d erp_enterprisecloud -f 04_DATABASE/01_schema_postgresql.sql
   psql -h <RDS_ENDPOINT> -U postgres -d erp_enterprisecloud -f 04_DATABASE/02_seed_data.sql
   ```

### C. Servidor de Cómputo en Amazon EC2
1. Lanzar una instancia EC2 Ubuntu 24.04 LTS (tipo `t3.small` o `t3.medium`).
2. Pegar el contenido de `05_AWS/ec2/user_data_fastapi.sh` en el campo **User Data** de configuración avanzada.
3. Asociar un rol IAM a la instancia EC2 con la política `AmazonS3FullAccess` y `CloudWatchAgentServerPolicy`.
4. El balanceador de carga Application Load Balancer (ALB) dirigirá el tráfico HTTPS del puerto 443 al puerto 80/8000 de las instancias EC2.
