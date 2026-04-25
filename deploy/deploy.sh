#!/usr/bin/env bash
# deploy.sh — atualiza o app no VPS. Rodar no diretório /var/www/naturall-academy.
# Uso: bash deploy/deploy.sh
set -euo pipefail

cd "$(dirname "$0")/.."

echo "▶ Pulling latest code..."
git pull origin main || git pull origin master

echo "▶ Installing dependencies..."
npm ci --omit=dev=false  # precisa de devDeps pra build

echo "▶ Building..."
NODE_ENV=production npm run build

echo "▶ Reloading PM2..."
if pm2 describe naturall-academy >/dev/null 2>&1; then
  pm2 reload naturall-academy --update-env
else
  pm2 start ecosystem.config.cjs --env production
  pm2 save
  pm2 startup systemd -u root --hp /root | tail -1 | bash || true
fi

pm2 status naturall-academy

echo ""
echo "✅ Deploy concluído. App em http://127.0.0.1:3000 (atrás do Nginx)."
