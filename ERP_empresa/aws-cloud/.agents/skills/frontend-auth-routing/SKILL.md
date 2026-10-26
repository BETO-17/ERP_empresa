---
name: frontend-auth-routing
description: Implementa autenticación, rutas protegidas y navegación por roles en ERP EnterpriseCloud sin sustituir la autorización del servidor.
---

# Skill: Autenticación y navegación

## Objetivo
Mantener una navegación clara y controlar la experiencia según sesión, rol y permisos devueltos por el backend.

## Reglas
- Inspecciona primero el sistema de rutas y autenticación existente.
- Centraliza la lectura del estado de sesión en un provider, store o mecanismo ya utilizado por el proyecto.
- Implementa rutas públicas, autenticadas y no autorizadas de forma explícita.
- Muestra estados de carga mientras se verifica la sesión.
- Redirige de manera predecible después del inicio o cierre de sesión.
- Evita bucles de redirección.
- Limpia el estado de sesión al cerrar sesión o recibir una expiración confirmada.
- No inventes roles ni permisos; usa los definidos por el backend.

## Roles y permisos
- La interfaz puede ocultar o deshabilitar acciones que el usuario no puede ejecutar.
- El backend debe verificar permisos en cada operación protegida.
- No trates el rol guardado en el navegador como una fuente confiable de autorización.
- Si un permiso no está disponible, no asumas que el usuario tiene acceso privilegiado.

## Experiencia de usuario
- Proporciona formularios accesibles con validación.
- Distingue credenciales inválidas, sesión expirada, errores de red y errores inesperados sin exponer detalles sensibles.
- Incluye una página de acceso denegado y una ruta no encontrada.
- No incluyas contraseñas o tokens en logs, URL o mensajes de error.
