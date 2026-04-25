// PM2 — mantém o app Next rodando em produção e reinicia se cair.
// Uso: pm2 start ecosystem.config.cjs --env production
module.exports = {
  apps: [
    {
      name: "naturall-academy",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000 -H 127.0.0.1",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "800M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
