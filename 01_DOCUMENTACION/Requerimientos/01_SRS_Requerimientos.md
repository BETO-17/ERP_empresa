# 01. ESPECIFICACIÓN DE REQUERIMIENTOS DEL SISTEMA (SRS)
## ERP EnterpriseCloud — Sistema Integrado en Cloud Computing

> **Referencia:** Documento Maestro del Sistema Empresarial | Versión 1.0 (2026)  
> **Base Curricular:** Semana 07: Tecnología Cloud con AWS  
> **Estándares Operativos:** Eficiencia en redes inestables, Carga XLSX tipo Power BI, Auditoría IA con AWS Insights y Cumplimiento Normativo Perú (SUNAT).

---

## 1. Propósito y Alcance

El sistema **ERP EnterpriseCloud** centraliza los procesos comerciales, logísticos, operativos y financieros de una organización moderna mediante una arquitectura desacoplada y preparada para servicios de nube en AWS. Su diseño prioriza la estabilidad en conexiones con latencia o ancho de banda limitado, el cumplimiento normativo tributario y la auditoría predictiva.

---

## 2. Requerimientos Funcionales (RF)

| Código | Módulo | Descripción del Requerimiento |
| :--- | :--- | :--- |
| **RF-01** | **Dashboard** | Visualizar indicadores ejecutivos en tiempo real: volumen de ventas, valorización de compras, productos críticos de stock, cuentas por cobrar, cuentas por pagar y margen financiero. |
| **RF-02** | **Comercial / Ventas** | Gestión integral del ciclo comercial: emisión de cotizaciones, pedidos, facturas de venta, control de clientes y registro de estados de cobranza. |
| **RF-03** | **Abastecimiento / Compras** | Registro de proveedores homologados, generación de solicitudes, órdenes de compra y recepción de mercadería con actualización automática de stock. |
| **RF-04** | **Inventario y Almacenes** | Catálogo maestro de productos (SKU), categorías, multialmacén, control de existencias en tiempo real, registro de movimientos Kardex y transferencias entre almacenes. |
| **RF-05** | **Finanzas y Tesorería** | Gestión de cuentas por cobrar (CxC), cuentas por pagar (CxP), registro de pagos, amortizaciones bancarias y flujo de caja operativo. |
| **RF-06** | **Repositorio Documental Cloud** | Carga, indexación y descarga de archivos digitales (facturas, contratos, guías en PDF) vinculados directamente a operaciones empresariales y almacenados en Amazon S3. |
| **RF-07** | **Administración y Control RBAC** | Mantenimiento de usuarios corporativos, asignación de roles predefinidos (`admin`, `ventas`, `compras`, `almacen`, `finanzas`) y configuración general de la empresa. |
| **RF-08** | **Auditoría de Operaciones** | Registro automático de eventos críticos (usuario, acción, módulo, registro afectado, fecha/hora y resultado) para trazabilidad regulatoria e interna. |
| **RF-09** | **Generación de Reportes** | Emisión y exportación de reportes operativos y analíticos en formato PDF y hojas de cálculo. |
| **RF-10** | **Perfil y Sesión de Usuario** | Autenticación mediante credenciales seguras, generación de tokens JWT con caducidad y visualización del perfil corporativo activo. |
| **RF-11** | **Carga Masiva Estructurada en Excel (XLSX)** | Motor de importación masiva basado exclusivamente en plantillas Excel (.xlsx). Evita los errores de delimitadores de texto (comas, tabuladores, guiones) típicos del formato CSV y preserva esquemas relacionales complejos de productos, clientes e inventarios similares al modelo de Power BI. |
| **RF-12** | **Auditoría Inteligente con AWS Insights e IA** | Integración con servicios analíticos de AWS (Amazon CloudWatch Logs Insights, DevOps Guru y modelos LLM) para detectar patrones anómalos, transacciones sospechosas, identificar cuellos de botella y redactar resúmenes balanceados con recomendaciones de optimización. |
| **RF-13** | **Adaptación a Normativas Locales (Perú - SUNAT)** | Soporte estricto de identificadores tributarios oficiales (RUC de 11 dígitos con validación de dígito verificador, DNI de 8 dígitos), cálculo automático de IGV (18%), catálogos de comprobantes SUNAT (Factura 01, Boleta 03, Nota de Crédito 07, Guía de Remisión 09) y soporte para regímenes de detracción y retención. |
| **RF-14** | **Módulo ETL para Migración de Datos Legados** | Proceso desacoplado de Extracción, Transformación y Carga (ETL) que permite migrar bases de datos heredadas o formatos antiguos hacia el esquema relacional de PostgreSQL sin degradar el rendimiento transaccional del ERP durante horas hábiles. |

---

## 3. Requerimientos No Funcionales (RNF)

| Código | Categoría | Criterio de Aceptación |
| :--- | :--- | :--- |
| **RNF-01** | **Rendimiento** | Las consultas de listado y dashboard deben responder en menos de 1.5 segundos bajo condiciones normales de red. |
| **RNF-02** | **Seguridad** | Cifrado de contraseñas mediante algoritmo Bcrypt con salt rounds >= 12. Transmisión segura bajo HTTPS / TLS. |
| **RNF-03** | **Disponibilidad** | Arquitectura cloud tolerante a fallos desplegable en Amazon EC2 con balanceador de carga ALB y base de datos relacional Multi-AZ en Amazon RDS. |
| **RNF-04** | **Escalabilidad** | Capacidad de incremento horizontal de instancias EC2 mediante Auto Scaling Groups según métricas de CPU en CloudWatch. |
| **RNF-05** | **Usabilidad** | Interfaz responsive diseñada para pantallas de escritorio (1920x1080), tablets y móviles, cumpliendo estándares de accesibilidad visual y contraste. |
| **RNF-06** | **Diseño e Interfaces de Alta Resiliencia** | **Entrada directa de datos sin modales bloqueantes:** Las operaciones de captura rápida deben poder realizarse directamente en la página (paneles laterales embebidos o edición en fila) para evitar bloqueos por pérdida de paquetes en conexiones de internet inestables. |
| **RNF-07** | **Control de Sobrecarga en Selectores** | Todos los menús desplegables (`<select>` / combobox) deben limitar las opciones visibles a un **máximo de 5 elementos directos**; para catálogos mayores, la interfaz debe activar búsqueda predictiva / autocompletado paginado para reducir el peso del DOM y el consumo de ancho de banda. |
