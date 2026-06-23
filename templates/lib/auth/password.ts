// VibeGuard password hashing — for CUSTOM auth only. (VG-006)
// NOTE: if you use Supabase Auth, password storage is handled for you — prefer it.
// This is here for the case where you roll your own credential store.

import argon2 from "argon2";

// Argon2id with sensible cost parameters (OWASP / NIST SP 800-63B aligned).
const OPTIONS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 19_456, // 19 MiB
  timeCost: 2,
  parallelism: 1,
};

export async function hashPassword(plain: string): Promise<string> {
  if (plain.length < 8) throw new Error("Password too short");
  return argon2.hash(plain, OPTIONS);
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plain);
  } catch {
    return false; // never throw raw crypto errors to the caller
  }
}

// Never: store plaintext, use md5/sha1, or log the password / hash. (VG-006, VG-016)
