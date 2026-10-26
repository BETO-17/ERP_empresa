# ERP EnterpriseCloud | Frontend Development Prompt

## 1. Rol del agente

Actúa como un arquitecto frontend senior y desarrollador especializado en React, TypeScript, diseño de sistemas empresariales ERP, UX/UI, accesibilidad, dashboards y consumo de API REST.

Debes desarrollar el frontend de **ERP EnterpriseCloud**, una plataforma SaaS empresarial que centraliza procesos comerciales, administrativos, operativos y financieros.

Antes de comenzar, lee el archivo `AGENTS.md` y las skills del proyecto. Respeta las instrucciones existentes y analiza la estructura del repositorio para evitar sobrescribir código o configuraciones importantes.

## 2. Objetivo principal

Construir una aplicación frontend empresarial profesional, modular, responsive y preparada para producción.

La interfaz debe permitir que los usuarios naveguen de forma intuitiva entre los módulos, consulten información, administren registros, ejecuten operaciones y visualicen indicadores empresariales.

No construyas únicamente un dashboard estático. Implementa una aplicación con navegación funcional, páginas coherentes, formularios, tablas, validaciones, estados de interfaz y servicios preparados para conectarse al backend.

## 3. Stack tecnológico

Utiliza las tecnologías siguientes:

- React.
- TypeScript con tipado estricto.
- Vite, si ya es el entorno de construcción del proyecto.
- React Router para navegación, si resulta compatible con la configuración existente.
- Lucide React para iconografía, si está instalado o se aprueba incorporarlo.
- CSS modular o la estrategia de estilos que ya utilice el proyecto.
- Fetch API o el cliente HTTP existente para consumir la API REST.
- Vitest y React Testing Library para pruebas, si son compatibles con el repositorio.

No cambies versiones ni reemplaces dependencias existentes sin revisar primero `package.json` y justificar la necesidad.

## 4. Identidad visual

Diseña una interfaz empresarial moderna, sobria y profesional.

### Paleta visual

- Azul marino oscuro para navegación y elementos principales.
- Azul corporativo para acciones primarias y elementos interactivos.
- Blanco y gris claro para superficies y áreas de trabajo.
- Gris neutro para bordes, divisores y textos secundarios.
- Verde para operaciones satisfactorias.
- Ámbar para advertencias.
- Rojo para errores, riesgos y acciones destructivas.

Define los colores mediante variables CSS reutilizables.

### Principios de diseño

- Jerarquía visual clara.
- Espaciado consistente.
- Tipografía legible.
- Iconos coherentes.
- Tablas compactas y fáciles de consultar.
- Formularios claros y organizados.
- Contraste accesible.
- Diseño responsive.
- Animaciones discretas y funcionales.
- Sin exceso de tarjetas, gradientes, sombras o elementos decorativos.

La prioridad es la productividad del usuario empresarial, no la decoración.

## 5. Estructura general de la aplicación

Implementa un layout empresarial que contenga:

### A. Sidebar

Incluye navegación agrupada por áreas de negocio:

**General**
- Dashboard.

**Comercial**
- Clientes.
- Ventas.
- Cotizaciones.
- Pedidos.

**Abastecimiento**
- Proveedores.
- Compras.
- Órdenes de compra.
- Recepción de mercancía.

**Inventario**
- Productos.
- Categorías.
- Almacenes.
- Existencias.
- Kardex.
- Transferencias y ajustes.

**Finanzas**
- Cuentas por cobrar.
- Cuentas por pagar.
- Caja y bancos.
- Pagos.
- Ingresos y egresos.

**Documentos**
- Repositorio documental.

**Administración**
- Usuarios.
- Roles y permisos.
- Auditoría.
- Configuración.

**Reportes**
- Reportes operativos y analíticos.

Permite expandir y contraer el sidebar. En pantallas pequeñas, conviértelo en un menú adaptable.

Los elementos que todavía no tengan funcionalidad deben identificarse como pendientes o no estar habilitados. No simules que un módulo está implementado si no lo está.

### B. Header

Incluye:

- Breadcrumbs o ruta de navegación.
- Título de la página.
- Búsqueda global, inicialmente limitada a los recursos realmente implementados.
- Centro de notificaciones si existe una fuente real de datos.
- Perfil del usuario autenticado.
- Menú de sesión.
- Acción para cerrar sesión.

No muestres un usuario autenticado ficticio como si fuera real.

### C. Área principal

Debe mostrar la página seleccionada, respetando el layout y evitando recargar toda la aplicación al cambiar de módulo.

## 6. Dashboard principal

Crea un dashboard ejecutivo con información empresarial consolidada.

### Indicadores

- Ventas del periodo.
- Compras del periodo.
- Productos con stock crítico.
- Cuentas por cobrar pendientes.
- Cuentas por pagar pendientes.
- Utilidad, únicamente cuando existan datos y una fórmula de cálculo definida.

### Visualizaciones

- Evolución de ventas por periodo.
- Comparación de ventas y compras.
- Productos con mayor movimiento.
- Alertas de inventario.
- Actividad reciente.
- Resumen de operaciones.

### Comportamiento

- Los indicadores deben proceder de servicios de datos definidos.
- Los filtros temporales deben afectar realmente las consultas o los datos mostrados.
- Cada indicador debe incluir nombre, unidad, periodo y contexto.
- Incluye estados de carga, error y ausencia de datos.
- No inventes cifras ni porcentajes de crecimiento.
- Si utilizas datos de demostración, identifica claramente el modo demo.
- Evita gráficos sin significado empresarial.

El dashboard debe servir como punto de entrada para navegar hacia los registros que explican cada indicador.

## 7. Diseño de los módulos funcionales

Cada módulo debe compartir patrones visuales, pero mantener sus propias responsabilidades.

### Clientes

- Listado paginado.
- Búsqueda y filtros.
- Formulario de creación y edición.
- Vista de detalle.
- Datos de contacto.
- Estado del cliente.
- Historial comercial cuando esté disponible.

### Proveedores

- Listado de proveedores.
- Búsqueda y filtros.
- Registro y edición.
- Información de contacto.
- Estado del proveedor.
- Historial de compras cuando esté disponible.

### Productos e inventario

- Listado de productos.
- Código y nombre.
- Categoría.
- Unidad de medida.
- Precio y coste cuando estén definidos.
- Existencias por almacén.
- Indicador de stock crítico.
- Detalle del producto.
- Historial de movimientos.
- Transferencias y ajustes mediante formularios específicos.

No permitas modificar el stock directamente desde cualquier formulario. Utiliza operaciones de inventario trazables.

### Ventas

- Listado de ventas.
- Filtros por fecha, cliente y estado.
- Creación de venta.
- Selección de cliente.
- Detalle con productos y cantidades.
- Precio unitario y subtotal.
- Totales calculados según las reglas de negocio disponibles.
- Estado de la operación.
- Consulta de pagos y documentos relacionados cuando existan.

### Cotizaciones y pedidos

- Listados independientes.
- Creación y edición.
- Detalle de productos.
- Estados de negocio diferenciados.
- Acciones según las transiciones permitidas.
- Conversión a pedido o venta únicamente cuando el flujo esté definido en el backend.

### Compras

- Solicitudes y órdenes de compra.
- Selección de proveedor.
- Productos y cantidades.
- Recepción de mercancía.
- Estado de compra.
- Documentos y pagos asociados cuando estén implementados.

### Finanzas

- Cuentas por cobrar.
- Cuentas por pagar.
- Pagos.
- Caja y bancos.
- Ingresos y egresos.
- Filtros por fechas y estado.

No inventes cálculos contables, impuestos o conciliaciones que no hayan sido definidos.

### Documentos

- Listado de documentos.
- Tipo y nombre.
- Fecha.
- Entidad empresarial relacionada.
- Estado de carga.
- Acciones permitidas según permisos.
- Carga y descarga mediante servicios preparados para el almacenamiento cloud.

Valida los archivos en la interfaz, sin sustituir la validación de seguridad del backend.

### Administración

- Listado de usuarios.
- Creación y edición.
- Activación o desactivación.
- Asignación de roles según permisos.
- Gestión de roles y permisos.
- Consulta de auditoría.
- Configuración general.

No permitas que un usuario se asigne permisos superiores desde el frontend.

### Reportes

- Filtros por fechas, módulo y estado.
- Tablas de resultados.
- Visualizaciones relevantes.
- Exportación CSV cuando sea necesaria y esté implementada.
- Estados vacíos y errores.

Los reportes deben basarse en datos reales del backend o en datos demo claramente identificados.

## 8. Arquitectura frontend

Primero inspecciona el repositorio.

Si el proyecto no tiene una arquitectura establecida, utiliza como referencia:

src/
- app/
  - router/
  - providers/
- components/
  - ui/
  - tables/
  - forms/
- layouts/
  - AppLayout
  - AuthLayout
- modules/
  - dashboard/
  - customers/
  - suppliers/
  - sales/
  - purchases/
  - inventory/
  - finance/
  - documents/
  - administration/
  - reports/
- services/
  - apiClient
  - authService
- hooks/
- types/
- utils/
- styles/

Cada módulo puede organizarse en:

- `pages/`
- `components/`
- `hooks/`
- `services/`
- `types/`

No crees archivos vacíos solo para completar el árbol. Cada carpeta debe tener una responsabilidad concreta.

## 9. Integración con FastAPI

Prepara el frontend para consumir el backend bajo una configuración centralizada.

Variable de entorno esperada:

`VITE_API_BASE_URL=http://localhost:8000/api/v1`

La URL es un valor de desarrollo de ejemplo. Debe poder cambiarse según el entorno.

Implementa:

- Cliente HTTP centralizado.
- Tipos para solicitudes y respuestas.
- Manejo uniforme de errores HTTP.
- Indicadores de carga.
- Cancelación de solicitudes cuando sea pertinente.
- Servicios por módulo.
- Configuración mediante variables de entorno.
- Archivo `.env.example` sin credenciales.

No escribas secretos en variables `VITE_*`, ya que estas pueden quedar expuestas en el navegador.

No inventes contratos API definitivos. Si el backend aún no está implementado, documenta los contratos esperados y separa claramente los adaptadores mock de los servicios reales.

## 10. Autenticación y autorización

Prepara una pantalla de inicio de sesión y el flujo de sesión de usuario.

Incluye:

- Formulario con validaciones.
- Errores de autenticación comprensibles.
- Rutas protegidas.
- Manejo de sesión expirada.
- Cierre de sesión.
- Navegación adaptada a los permisos disponibles.
- Estados de acceso denegado.

El mecanismo definitivo de autenticación debe coincidir con el backend.

No guardes tokens sensibles en `localStorage` por defecto. Coordina la estrategia de sesión con el backend, considerando cookies seguras `HttpOnly` cuando corresponda.

La autorización real siempre debe verificarse en el servidor.

## 11. Componentes reutilizables

Construye componentes compartidos cuando exista una necesidad real:

- Button.
- Input.
- Select.
- Modal.
- ConfirmDialog.
- DataTable.
- Pagination.
- SearchBar.
- FilterBar.
- StatusBadge.
- PageHeader.
- Breadcrumbs.
- LoadingState.
- EmptyState.
- ErrorState.
- Toast o sistema de notificaciones.
- FormField.
- MetricCard.

Define variantes y tipos consistentes. Evita duplicar componentes equivalentes en cada módulo.

## 12. Seguridad y accesibilidad

- Evita renderizar contenido no confiable como HTML sin sanitización.
- No incluyas secretos ni credenciales en el frontend.
- Valida datos antes de enviarlos al backend.
- No confíes en permisos calculados exclusivamente en el cliente.
- Evita acciones destructivas accidentales.
- Usa etiquetas accesibles y navegación por teclado.
- Respeta el contraste y los mensajes de error.
- No expongas detalles internos de excepciones.

## 13. Pruebas y calidad

Incluye pruebas para:

- Navegación.
- Formularios.
- Validaciones.
- Tablas y filtros.
- Estados de carga y error.
- Rutas protegidas.
- Comportamiento ante respuestas HTTP fallidas.
- Permisos visuales.
- Componentes compartidos.

Antes de finalizar, ejecuta las verificaciones disponibles:

- Linter.
- TypeScript.
- Build de producción.
- Pruebas automatizadas.

Corrige los errores introducidos por los cambios y documenta cualquier verificación que no se haya podido ejecutar.

## 14. Plan de implementación

Trabaja por entregas:

**Entrega 1:** análisis del repositorio, arquitectura frontend, sistema de diseño, layout y navegación.

**Entrega 2:** autenticación, rutas protegidas y servicios base.

**Entrega 3:** dashboard y componentes compartidos.

**Entrega 4:** clientes, proveedores, productos e inventario.

**Entrega 5:** ventas, cotizaciones, pedidos y compras.

**Entrega 6:** finanzas, documentos, administración y reportes.

**Entrega 7:** integración real con FastAPI, pruebas integrales y optimización.

Ajusta el orden según las dependencias detectadas.

## 15. Primera tarea obligatoria

No comiences generando todos los módulos de golpe.

Primero:

1. Inspecciona el repositorio y `package.json`.
2. Lee `AGENTS.md` y las skills frontend.
3. Identifica qué componentes, páginas, rutas y estilos existen.
4. Propón la arquitectura final y los cambios necesarios.
5. Implementa la Entrega 1 conservando la funcionalidad existente.
6. Ejecuta las verificaciones disponibles.
7. Entrega un resumen con archivos modificados, comandos de ejecución, pruebas realizadas y próximos pasos.

El resultado debe ser un frontend ERP profesional, modular y funcional, preparado para integrarse progresivamente con FastAPI, PostgreSQL y AWS, sin fingir que las funcionalidades del backend ya existen.