import { Client } from "ssh2";

const HOST = "76.13.121.80";
const USER = "root";
const PASS = process.env.VPS_PASSWORD;
const CMD = process.argv.slice(2).join(" ");

if (!PASS || !CMD) {
  console.error("Uso: VPS_PASSWORD=... node vps-exec.mjs '<cmd>'");
  process.exit(1);
}

const conn = new Client();
conn
  .on("ready", () => {
    conn.exec(CMD, (err, stream) => {
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
  .connect({ host: HOST, port: 22, username: USER, password: PASS, readyTimeout: 30000 });
