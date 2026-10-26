# 02_FRONTEND — ERP EnterpriseCloud (React + TypeScript + Vite)

Este paquete corresponde a la capa de presentación del sistema ERP, desarrollada con **React 19**, **TypeScript** estricto, **Vite** y **Lucide React**, organizada según el diseño modular de la **Sección 14 del Documento Maestro**.

---

## 📂 Ubicación del Código Fuente

El código fuente funcional del frontend se encuentra en la carpeta:
`../aws-cloud/`

```text
aws-cloud/src/
├── app/               # Providers (Auth, Toast), Router principal
├── components/        # Componentes UI reutilizables (Tablas, Modales, FormField, Badges)
├── layouts/           # AppLayout, AuthLayout, Sidebar, Navbar
├── modules/           # Módulos de negocio (Dashboard, Ventas, Compras, Inventario, Finanzas, Documentos, etc.)
├── services/          # Cliente HTTP REST (apiClient.ts), Mock Store (mockStore.ts)
├── types/             # Definiciones TypeScript de entidades empresariales
└── utils/             # Formateadores de moneda, fechas, generador de PDF (jspdf)
```

---

## ⚙️ Conexión con Backend FastAPI y AWS

El frontend dispone de dos modos de operación configurables en `aws-cloud/.env`:

1. **Modo Simulado (`VITE_DATA_MODE=simulated`):**  
   Permite demostraciones completas e interactivas sin necesidad de levantar PostgreSQL ni FastAPI de inmediato.
2. **Modo API Real (`VITE_DATA_MODE=api`):**  
   Conecta todas las operaciones del cliente con el backend FastAPI en `http://localhost:8000/api/v1` o la dirección IP pública del balanceador ALB en AWS.

---

## 🚀 Comandos de Ejecución

```bash
cd aws-cloud
npm install
npm run dev
```
Acceso en navegador: `http://localhost:5173`
