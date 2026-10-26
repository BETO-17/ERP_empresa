---
name: frontend-react-typescript
description: Construye el frontend de ERP EnterpriseCloud con React y TypeScript, siguiendo una arquitectura mantenible, accesible y orientada a módulos empresariales.
---

# Skill: Frontend React + TypeScript

## Objetivo
Desarrollar una interfaz empresarial para ERP EnterpriseCloud. El frontend debe ser modular, responsive, accesible y estar preparado para consumir la API REST de FastAPI.

## Antes de modificar
1. Inspecciona la estructura real del repositorio, `package.json`, configuración de TypeScript y estilos.
2. Lee `AGENTS.md` y las skills disponibles.
3. Reutiliza las dependencias y convenciones existentes cuando sean adecuadas.
4. No reemplaces la estructura completa ni elimines funcionalidades sin una razón técnica explícita.

## Principios
- Usa TypeScript estricto; evita `any`. Si es inevitable, documenta la razón y limita su alcance.
- Divide la UI por módulos de negocio y componentes reutilizables.
- Separa presentación, lógica de interfaz, acceso a API y tipos.
- Mantén componentes pequeños con responsabilidades claras.
- Evita duplicar validaciones, estilos, llamadas HTTP o lógica de permisos.
- No inventes endpoints ni campos del backend. Si falta el contrato, define un tipo provisional explícito y señala qué debe confirmarse.
- No uses datos ficticios como si fueran datos reales. Identifica claramente los datos demo.

## Estructura de referencia
Adapta esta estructura a la existente, no la impongas ciegamente:

```text
src/
  app/
    router.tsx
    providers/
  components/
    ui/
    feedback/
    data-display/
  layouts/
  features/
    dashboard/
    customers/
    suppliers/
    products/
    inventory/
    sales/
    purchases/
    finance/
    documents/
    administration/
    reports/
  services/
    api-client.ts
    auth.service.ts
  hooks/
  types/
  utils/
  styles/
```

Cada feature puede contener `components/`, `pages/`, `hooks/`, `services/`, `types.ts` y `index.ts` según su complejidad.

## Diseño visual
- Apariencia empresarial, limpia y consistente.
- Paleta recomendada: azul marino para navegación, azul corporativo para acciones, blanco y grises suaves para superficies, verde para éxito, ámbar para advertencias y rojo para errores.
- Usa una escala consistente de espaciado, tipografía, bordes y estados.
- Diseña primero para escritorio sin descuidar tabletas y móviles.
- Incluye estados de carga, vacío, error, éxito y deshabilitado.
- Evita dashboards recargados, gradientes decorativos excesivos y animaciones que distraigan.

## Componentes reutilizables
Prioriza cuando sean necesarios:
- `PageHeader`, `Breadcrumbs`, `Button`, `Input`, `Select`, `FormField`
- `DataTable`, `Pagination`, `SearchBar`, `FilterBar`, `StatusBadge`
- `Modal`, `ConfirmDialog`, `Toast`
- `LoadingState`, `EmptyState`, `ErrorState`
- `MetricCard`, gráficos y contenedores de panel

Los componentes deben aceptar props tipadas y exponer estados accesibles. No crees abstracciones genéricas antes de tener casos reales de reutilización.

## Entrega
Al terminar una tarea:
1. Resume archivos creados o modificados.
2. Explica decisiones relevantes y supuestos.
3. Ejecuta lint, pruebas y build disponibles.
4. Reporta errores reales; no afirmes que una comprobación pasó si no se ejecutó.
