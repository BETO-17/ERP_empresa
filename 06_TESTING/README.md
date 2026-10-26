# 06_TESTING — Estrategia de Pruebas Automatizadas

Este directorio agrupa los planes, casos y scripts de pruebas automáticas para el backend (Pytest), frontend (Vitest) y pruebas de carga, garantizando la estabilidad antes de la entrega o despliegue en AWS.

---

## 🧪 Ejecución de Pruebas Unitarias del Backend

```bash
cd ../03_BACKEND
source venv/bin/activate # En Windows: .\venv\Scripts\activate
pytest -v
```

---

## ⚛️ Ejecución de Pruebas del Frontend

```bash
cd ../aws-cloud
npm run lint
```
Valida la ausencia de errores de tipado TypeScript y buenas prácticas de React.
