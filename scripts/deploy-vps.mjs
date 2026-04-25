import { Client } from "ssh2";

const HOST = "76.13.121.80";
const USER = "root";
const PASS = process.env.VPS_PASSWORD;

if (!PASS) {
  console.error("VPS_PASSWORD env não definida");
  process.exit(1);
}

const cmd = `set -e
cd /var/www/naturall-academy
echo '▶ git pull'
git pull origin main
echo '▶ npm ci'
npm ci
echo '▶ build'
NODE_ENV=production npm run build
echo '▶ pm2 reload'
pm2 reload naturall-academy --update-env
pm2 status naturall-academy
echo '✅ done'
`;

const conn = new Client();
conn
  .on("ready", () => {
    conn.exec(cmd, (err, stream) => {
      if (err) {
        console.error(err);
        conn.end();
        process.exit(1);
      }
      stream
        .on("close", (code) => {
          conn.end();
          process.exit(code ?? 0);
        })
        .on("data", (d) => process.stdout.write(d))
        .stderr.on("data", (d) => process.stderr.write(d));
    });
  })
  .on("error", (e) => {
    console.error("SSH error:", e.message);
    process.exit(1);
  })
  .connect({
    host: HOST,
    port: 22,
    username: USER,
    password: PASS,
    readyTimeout: 30000,
  });
