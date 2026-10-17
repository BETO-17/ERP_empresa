---
name: dashboard-analytics
description: Implementa el dashboard y reportes analíticos de ERP EnterpriseCloud con métricas trazables, visualizaciones claras y estados de datos confiables.
---

# Skill: Dashboard y analítica

## Objetivo
Presentar una visión ejecutiva del ERP mediante indicadores, gráficos, tablas resumidas y filtros útiles para ventas, compras, inventario y finanzas.

## Reglas de datos
- Define cada KPI con nombre, unidad, periodo, fuente y fórmula antes de implementarlo.
- No calcules utilidad, margen, deuda o crecimiento sin una definición de negocio y datos suficientes.
- Distingue datos reales de datos de demostración.
- Los estados sin información deben mostrarse como vacíos o “Sin datos”, no como ceros engañosos.
- Los filtros de fecha, almacén, estado o unidad de negocio deben afectar realmente las consultas o visualizaciones.
- No inventes resultados ni simules datos reales del backend.

## Indicadores sugeridos
Solo implementar cuando exista soporte de datos:
- Ventas del periodo.
- Compras del periodo.
- Productos con stock bajo.
- Cuentas por cobrar y por pagar.
- Órdenes pendientes.
- Evolución de ventas y compras.
- Distribución del inventario por categoría.
- Actividad reciente.

## Visualizaciones
- Cada gráfico debe responder una pregunta concreta.
- Incluye título, periodo, leyenda y unidades cuando correspondan.
- Asegura contraste, etiquetas legibles y alternativa textual cuando sea necesario.
- No dependas únicamente del color para transmitir estados.
- En pantallas pequeñas, adapta o apila gráficos y tablas.

## Implementación
1. Inspecciona las librerías de gráficos instaladas antes de añadir una nueva.
2. Define tipos para las respuestas del API.
3. Separa el cálculo de métricas de los componentes visuales.
4. Maneja carga, error, falta de datos y filtros.
5. Añade pruebas para cálculos relevantes.
