#!/usr/bin/env bash
# setup-vps.sh — bootstrap do VPS Ubuntu 24.04. Rodar UMA VEZ como root.
# Uso (no VPS): bash deploy/setup-vps.sh
set -euo pipefail

DOMAIN="naturallacademy.com"
APP_DIR="/var/www/naturall-academy"
NODE_MAJOR=20

echo "▶ Atualizando sistema..."
apt update && apt upgrade -y

echo "▶ Instalando dependências base..."
apt install -y curl git ufw nginx ca-certificates gnupg

echo "▶ Instalando Node.js ${NODE_MAJOR}..."
mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
  | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_MAJOR}.x nodistro main" \
  > /etc/apt/sources.list.d/nodesource.list
apt update && apt install -y nodejs
node -v
npm -v

echo "▶ Instalando PM2..."
npm install -g pm2

echo "▶ Configurando firewall (UFW)..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
ufw status

echo "▶ Criando diretório do app..."
mkdir -p "${APP_DIR}"

echo "▶ Configurando Nginx..."
if [ -f "${APP_DIR}/deploy/nginx.conf" ]; then
  cp "${APP_DIR}/deploy/nginx.conf" /etc/nginx/sites-available/naturall-academy
  ln -sf /etc/nginx/sites-available/naturall-academy /etc/nginx/sites-enabled/naturall-academy
  rm -f /etc/nginx/sites-enabled/default
  nginx -t && systemctl reload nginx
else
  echo "  ⚠ deploy/nginx.conf não encontrado — pulando (rode após o git clone)"
fi

echo "▶ Instalando Certbot (Let's Encrypt)..."
apt install -y certbot python3-certbot-nginx

echo ""
echo "✅ VPS preparado!"
echo ""
echo "Próximos passos manuais:"
echo "  1. cd ${APP_DIR} && git clone <REPO_URL> ."
echo "  2. Criar .env.production em ${APP_DIR} com as variáveis"
echo "  3. bash deploy/deploy.sh"
echo "  4. certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
