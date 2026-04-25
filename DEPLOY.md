# Deploy — Naturall Academy → Hostinger VPS

Passo-a-passo do zero até `https://naturallacademy.com` no ar.

VPS: Ubuntu 24.04, IP `76.13.121.80`, acesso `ssh root@76.13.121.80`.
Domínio: `naturallacademy.com` (registrado na Hostinger).

---

## Passo 1 — Subir o código pro GitHub (no seu PC)

Crie um repositório **privado** no GitHub chamado `naturall-academy`. Não inicialize com README.

Depois, no terminal local, dentro de `site/`:

```bash
cd "c:/Users/Pichau/Downloads/projeto/projeto cosm BR/site"
git add .
git commit -m "initial: webapp EN-first com 600 receitas"
git branch -M main
git remote add origin git@github.com:SEU_USER/naturall-academy.git
git push -u origin main
```

> Se ainda não configurou SSH no GitHub, use HTTPS: `git remote add origin https://github.com/SEU_USER/naturall-academy.git`. Vai pedir login/token.

---

## Passo 2 — Apontar DNS na Hostinger

No hPanel: **Domínios → naturallacademy.com → DNS / Nameservers → Gerenciar registros DNS**.

Adicione (ou edite) os 2 registros A:

| Tipo | Nome | Aponta para        | TTL  |
|------|------|--------------------|------|
| A    | @    | `76.13.121.80`     | 3600 |
| A    | www  | `76.13.121.80`     | 3600 |

Apague qualquer outro registro A/AAAA conflitante.

DNS leva 5-30 min pra propagar. Você pode acompanhar:
```bash
nslookup naturallacademy.com
```

---

## Passo 3 — Bootstrap do VPS (uma vez só)

No seu PC, abra o **Terminal** do hPanel da Hostinger (botão "Terminal" na visão geral do VPS) ou conecte via SSH:

```bash
ssh root@76.13.121.80
# (cola a senha root do hPanel — clica "Alterar" se ainda não definiu)
```

Já dentro do VPS:

```bash
mkdir -p /var/www/naturall-academy
cd /var/www/naturall-academy

# clona o repo (use HTTPS se for privado e gere um Personal Access Token no GitHub)
git clone https://github.com/SEU_USER/naturall-academy.git .

# roda o setup (Node 20 + PM2 + Nginx + Certbot + UFW)
bash deploy/setup-vps.sh
```

---

## Passo 4 — Variáveis de ambiente em produção

Ainda no VPS, dentro de `/var/www/naturall-academy`:

```bash
cp deploy/.env.production.example .env.production
nano .env.production
```

Preencha:
- `SUPABASE_SERVICE_ROLE_KEY` (mesma que está no seu `.env.local`)
- `KIWIFY_WEBHOOK_SECRET` — gere com `openssl rand -hex 32` (anote, vai colar na Kiwify depois)

Salve com `Ctrl+O`, `Enter`, `Ctrl+X`.

---

## Passo 5 — Build + start

```bash
bash deploy/deploy.sh
```

Confere se subiu:
```bash
pm2 status
curl -I http://127.0.0.1:3000/app/en
```

Se vier `200 OK`, está rodando.

---

## Passo 6 — HTTPS (Let's Encrypt)

**Pré-requisito:** o DNS do passo 2 já tem que estar propagado (`nslookup` retornar o IP do VPS).

```bash
certbot --nginx -d naturallacademy.com -d www.naturallacademy.com
```

Responda:
- E-mail: o seu
- Aceite os termos
- Redirect HTTP → HTTPS: **Yes (2)**

Pronto. Acesse https://naturallacademy.com/app/en

Renovação automática já está agendada via systemd timer. Pode confirmar:
```bash
systemctl list-timers | grep certbot
```

---

## Passo 7 — Configurar Supabase Auth

No dashboard Supabase do projeto `naturall-academy`:

**Authentication → URL Configuration**

- **Site URL:** `https://naturallacademy.com`
- **Redirect URLs (adicionar):**
  - `https://naturallacademy.com/auth/callback`
  - `https://naturallacademy.com/app/**`

Salvar.

---

## Passo 8 — Configurar webhook Kiwify (quando criar produto)

Na Kiwify, no produto de assinatura:

**Configurações → Webhooks** (ou Notificações):
- **URL:** `https://naturallacademy.com/api/webhook/kiwify?token=<COLE_O_KIWIFY_WEBHOOK_SECRET>`
- **Eventos:** marcar todos relacionados a compra, assinatura e cancelamento.

Test do endpoint (do seu PC):
```bash
curl https://naturallacademy.com/api/webhook/kiwify
# {"ok":true,"name":"kiwify webhook"}
```

---

## Atualizações futuras (quando você mudar código)

No seu PC: `git push`. No VPS:
```bash
cd /var/www/naturall-academy
bash deploy/deploy.sh
```

PM2 reinicia o app sem downtime.

---

## Comandos úteis

```bash
pm2 logs naturall-academy        # ver logs em tempo real
pm2 restart naturall-academy     # reiniciar
pm2 monit                        # painel ao vivo

systemctl status nginx           # status do nginx
nginx -t                         # validar config
systemctl reload nginx           # reload sem dropar conexão

ufw status                       # firewall
df -h                            # uso de disco
free -h                          # uso de memória
```

---

## Troubleshooting

**`502 Bad Gateway`** → app não está rodando. `pm2 status` e `pm2 logs`.

**`Connection refused` no certbot** → DNS ainda não propagou. Espera mais e tenta de novo.

**Webhook recebe `401`** → o `?token=...` na URL da Kiwify não bate com `KIWIFY_WEBHOOK_SECRET` no `.env.production`. Após editar o `.env`, rode `pm2 reload naturall-academy --update-env`.

**Login não envia magic link** → confira nas Authentication → Email Templates se está habilitado, e veja os logs em Supabase → Logs → Auth.
