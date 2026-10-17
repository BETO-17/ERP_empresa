---
name: frontend-testing
description: Verifica los componentes, formularios, rutas e integración de ERP EnterpriseCloud con pruebas reproducibles.
---

# Skill: Pruebas frontend

## Primero
Inspecciona los scripts de `package.json`, el framework de pruebas y las herramientas existentes. Reutiliza la configuración actual si es adecuada.

## Pruebas recomendadas
- Pruebas unitarias para utilidades, formateadores y cálculos de KPIs.
- Pruebas de componentes para formularios, tablas, estados y diálogos.
- Pruebas de integración para flujos como crear un cliente o registrar un producto.
- Pruebas de rutas protegidas y permisos visuales.
- Pruebas de errores de API, respuestas vacías y carga.
- Pruebas de regresión para los flujos principales.

## Reglas
- Usa datos de prueba explícitos y deterministas.
- Evita depender de servicios externos reales en pruebas unitarias.
- No hagas pruebas frágiles que dependan del texto decorativo o de detalles internos irrelevantes.
- Corrige fallos introducidos por el cambio antes de darlo por terminado.
- Ejecuta lint, typecheck, tests y build según los scripts disponibles.
- Informa exactamente qué comandos se ejecutaron y cuáles pasaron o fallaron.
