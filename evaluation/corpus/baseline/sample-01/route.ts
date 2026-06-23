// DEMO FIXTURE — intentionally vulnerable (built WITHOUT VibeGuard). Do not copy.
import crypto from "node:crypto";
import { exec } from "node:child_process";

const JWT_SECRET = "supersecretjwt"; // VG-007 hardcoded common secret

export async function POST(req: any) {
  const body = await req.json();
  console.log("incoming", req, "password=", body.password); // VG-016 PII in logs

  const id = req.params.id;
  const sql = "SELECT * FROM users WHERE id = " + id; // VG-011 SQL string concat
  const hash = crypto.createHash("md5").update(body.password).digest("hex"); // VG-006 weak hash

  exec("convert " + body.filename + " out.png"); // VG-013 command injection

  return { sql, hash, JWT_SECRET };
}
