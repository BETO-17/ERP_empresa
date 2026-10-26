#!/bin/bash
# Script de aprovisionamiento automatizado (User Data) para Amazon EC2
# Despliegue de Backend FastAPI + Nginx Reverse Proxy en Ubuntu 24.04 LTS

set -e

# 1. Actualización de paquetes
apt-get update -y
apt-get upgrade -y

# 2. Instalación de dependencias del sistema y Python
apt-get install -y python3-pip python3-venv git nginx libpq-dev curl

# 3. Directorio de la aplicación
mkdir -p /opt/erp_backend
cd /opt/erp_backend

# 4. Clonar o sincronizar repositorio
# git clone https://github.com/tu-organizacion/ERP_empresa.git .
# cp -r 03_BACKEND/* /opt/erp_backend/

# 5. Creación del entorno virtual
python3 -m venv /opt/erp_backend/venv
source /opt/erp_backend/venv/bin/activate
pip install --upgrade pip
pip install fastapi uvicorn[standard] sqlalchemy psycopg2-binary pydantic pydantic-settings python-jose[cryptography] passlib[bcrypt] boto3

# 6. Servicio Systemd para Uvicorn / FastAPI
cat << 'EOF' > /etc/systemd/system/erp_backend.service
[Unit]
Description=FastAPI ERP EnterpriseCloud Service
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/opt/erp_backend
ExecStart=/opt/erp_backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always
RestartSec=5
Environment=PORT=8000
Environment=PYTHONPATH=/opt/erp_backend

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable erp_backend
# systemctl start erp_backend

# 7. Configuración de Nginx como Reverse Proxy
cat << 'EOF' > /etc/nginx/sites-available/erp_api
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

ln -s /etc/nginx/sites-available/erp_api /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
systemctl restart nginx

echo "Aprovisionamiento de EC2 para ERP EnterpriseCloud finalizado exitosamente."
