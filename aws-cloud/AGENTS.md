# AGENTS.md · ERP EnterpriseCloud Frontend

## Misión
Construir el frontend de ERP EnterpriseCloud con React y TypeScript, con módulos empresariales consistentes, accesibilidad, seguridad en el cliente e integración tipada con la API FastAPI.

## Fuente de verdad
Antes de implementar, inspecciona el repositorio y los contratos reales del backend. El documento del proyecto define módulos de Dashboard, Ventas, Compras, Inventario, Clientes, Proveedores, Finanzas, Documentos, Administración y Reportes. No inventes reglas de negocio ni endpoints ausentes.

## Skills
- `.agents/skills/frontend-react-typescript/SKILL.md`
- `.agents/skills/dashboard-analytics/SKILL.md`
- `.agents/skills/frontend-api-integration/SKILL.md`
- `.agents/skills/frontend-auth-routing/SKILL.md`
- `.agents/skills/frontend-forms-tables/SKILL.md`
- `.agents/skills/frontend-accessibility-responsive/SKILL.md`
- `.agents/skills/frontend-testing/SKILL.md`

## Reglas obligatorias
1. Lee la estructura, dependencias y convenciones existentes antes de editar.
2. Conserva el trabajo existente y limita los cambios al alcance solicitado.
3. Usa TypeScript estricto y evita `any`.
4. Separa módulos, componentes, servicios y tipos.
5. Centraliza las llamadas HTTP y maneja estados de carga, error, vacío y éxito.
6. No coloques secretos en el código cliente ni en variables `VITE_*`.
7. El backend es la autoridad final para autenticación, autorización y validación.
8. No uses datos ficticios como si fueran datos reales.
9. Usa diseño empresarial responsive y controles accesibles.
10. No añadas dependencias sin justificar su valor y compatibilidad.
11. No declares pruebas o builds exitosos sin ejecutarlos.
12. No cambies contratos del backend para acomodar el frontend sin coordinación explícita.

## Flujo de trabajo
1. Inspeccionar repo y documentación.
2. Identificar el objetivo y criterios de aceptación.
3. Proponer un plan corto y archivos afectados.
4. Implementar en cambios pequeños.
5. Ejecutar lint, typecheck, tests y build disponibles.
6. Resumir cambios, pruebas y pendientes.

## Diseño de producto
Usa una apariencia profesional y clara. Paleta sugerida: azul marino para navegación, azul corporativo para acciones, fondos blancos/grises y colores semánticos para estados. Mantén jerarquía visual y evita saturar el dashboard.

## Seguridad
Nunca confíes en el frontend como barrera de autorización. No registres tokens ni datos sensibles. No persistas tokens sensibles en `localStorage` por defecto. No expongas secretos en variables de entorno de Vite.
