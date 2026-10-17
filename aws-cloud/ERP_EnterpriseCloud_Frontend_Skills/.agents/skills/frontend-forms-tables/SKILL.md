---
name: frontend-forms-tables
description: Construye formularios y tablas CRUD consistentes para clientes, proveedores, productos, ventas, compras e inventario.
---

# Skill: Formularios, tablas y CRUD

## Formularios
- Usa etiquetas visibles, mensajes de validación específicos y navegación por teclado.
- Valida tipos, campos requeridos, formatos y reglas que estén documentadas por el negocio.
- La validación del frontend mejora la experiencia, pero la validación del backend es obligatoria.
- Evita perder datos al mostrar un error recuperable.
- Deshabilita el envío mientras la operación está en curso y previene envíos duplicados.
- En acciones destructivas, pide confirmación y explica el efecto.

## Tablas
- Incluye estados de carga, vacío y error.
- Añade búsqueda, filtros, orden y paginación cuando los requisitos lo necesiten.
- Mantén filtros y orden sincronizados con el API cuando este los soporte.
- Usa formatos coherentes para moneda, fechas, cantidades y estados.
- Evita mostrar demasiadas columnas en móvil; permite desplazamiento horizontal o vistas adaptadas.
- Acciones por fila deben tener etiquetas accesibles y permisos acordes con el backend.

## CRUD
Para cada entidad:
1. Define campos y reglas según los requisitos reales.
2. Implementa listado y detalle si corresponde.
3. Implementa crear y editar con formularios reutilizables.
4. Implementa eliminar o desactivar solo si el negocio lo permite.
5. Maneja conflictos, duplicados y errores del servidor.
6. Refresca o actualiza la lista tras una operación exitosa.
7. Añade pruebas a validaciones y flujos críticos.

## Entidades del ERP
Aplica patrones consistentes a clientes, proveedores, productos, categorías, almacenes, cotizaciones, pedidos, órdenes de compra, pagos y documentos. No fuerces un formulario genérico para entidades con reglas de negocio diferentes.
