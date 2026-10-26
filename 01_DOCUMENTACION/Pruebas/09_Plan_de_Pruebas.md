# 09. PLAN DE PRUEBAS DEL SISTEMA
## ERP EnterpriseCloud

---

## 1. Niveles de Prueba (Sección 22 del Documento Maestro)

| Tipo de Prueba | Alcance | Herramientas Utilizadas |
| :--- | :--- | :--- |
| **Unitarias** | Validación de funciones individuales, cálculo de impuestos, formateadores y esquemas Pydantic. | Pytest (Backend) / Vitest (Frontend) |
| **Integración** | Verificación de interacción entre API FastAPI y base de datos PostgreSQL, así como contratos REST con el Frontend. | Pytest + TestClient + Httpx |
| **Seguridad** | Validación de restricción de rutas por roles (RoleGuard), expiración de JWT y sanitización de inputs. | Postman / Pytest Security Tests |
| **Rendimiento** | Evaluación de tiempos de respuesta bajo concurrencia simula múltiples terminales en almacén y ventas. | Locust / Apache Benchmark (ab) |
| **Aceptación** | Validación de flujos comerciales completos (Cotización -> Venta -> Kardex -> Factura S3). | Pruebas de extremo a extremo guiadas |

---

## 2. Casos de Prueba Críticos

1. **CP-01:** Intento de venta de producto con stock insuficiente -> Debe arrojar error 400 y no registrar la transacción.
2. **CP-02:** Intento de acceso a `/administration` con rol `ventas` -> Debe redirigir a `/unauthorized` con código 403.
3. **CP-03:** Subida de factura PDF a Amazon S3 -> El archivo debe quedar alojado con hash MD5 y el registro en la tabla `documentos`.
4. **CP-04:** Registro de transferencia de inventario -> El stock debe decrementarse en el almacén origen e incrementarse en el almacén destino en una sola transacción atómica (ACID).
