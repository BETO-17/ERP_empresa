---
name: frontend-api-integration
description: Conecta el frontend React de ERP EnterpriseCloud con la API FastAPI mediante servicios tipados, manejo de errores y configuración segura.
---

# Skill: Integración con API

## Configuración
- Usa una variable de entorno pública como `VITE_API_BASE_URL` para la URL base.
- Desarrollo local sugerido: `http://localhost:8000/api/v1`, siempre que coincida con la configuración real del backend.
- Añade `.env.example` sin secretos.
- Nunca coloques contraseñas, claves privadas, tokens de servicio o credenciales de base de datos en variables `VITE_*`; se exponen al navegador.

## Cliente HTTP
- Centraliza la configuración de `fetch` o de la librería ya instalada en `services/api-client.ts`.
- Define un formato común para errores y respuestas según el contrato real de FastAPI.
- Gestiona HTTP status, errores de red, timeout cuando aplique y respuestas no JSON.
- Evita repetir la URL base y la lógica de errores en cada componente.
- No ocultes los detalles técnicos útiles durante desarrollo, pero muestra mensajes seguros y comprensibles al usuario.

## Contratos
- Define interfaces y tipos para requests y responses.
- No asumas que los modelos de la base de datos son idénticos a los DTO del API.
- Confirma nombres de campos, paginación, filtros y códigos de estado con el backend.
- No inventes endpoints. Si aún no existen, documenta el endpoint pendiente.

## Estados de interfaz
Cada petición debe contemplar:
- carga,
- éxito,
- respuesta vacía,
- error recuperable,
- sesión expirada cuando aplique.

Evita llamadas duplicadas, estados obsoletos y actualizaciones de componentes desmontados. Usa las herramientas de datos ya presentes en el proyecto si las hay.

## Seguridad
- La autorización definitiva corresponde al backend.
- No confíes en ocultar un botón como única barrera de seguridad.
- No registres tokens ni datos personales sensibles en consola.
- No almacenes tokens sensibles en `localStorage` por defecto. Sigue el mecanismo de sesión establecido por el backend.
