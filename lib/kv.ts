// Dünner Redis-Wrapper für Dedup ("1 Report pro E-Mail") + Rate-Limiting.
// Nutzt Vercel KV / Upstash REST via fetch (keine SDK-Dependency).
// Ohne konfigurierte Env-Vars: In-Memory-Fallback (nur Dev/Dry-Run, 1 Instanz).

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const kvConfigured = Boolean(URL_ && TOKEN);

// ── In-Memory-Fallback ──
const mem = new Map<string, { value: string; expires: number }>();
function memGet(key: string): string | null {
  const e = mem.get(key);
  if (!e) return null;
  if (e.expires && e.expires < Date.now()) {
    mem.delete(key);
    return null;
  }
  return e.value;
}

async function redis(cmd: (string | number)[]): Promise<any> {
  if (!kvConfigured) return null;
  const res = await fetch(URL_!, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`KV error ${res.status}`);
  const data = await res.json();
  return data.result;
}

/**
 * Reserviert eine E-Mail atomar (SET key value NX EX). Gibt true zurück, wenn
 * neu reserviert – false, wenn bereits vorhanden (= schon ein Report angefordert).
 */
export async function reserveEmail(email: string): Promise<boolean> {
  const key = `report:email:${email.trim().toLowerCase()}`;
  const ttl = 60 * 60 * 24 * 365; // 1 Jahr
  if (!kvConfigured) {
    if (memGet(key)) return false;
    mem.set(key, { value: String(Date.now()), expires: Date.now() + ttl * 1000 });
    return true;
  }
  const result = await redis(["SET", key, String(Date.now()), "NX", "EX", ttl]);
  return result === "OK";
}

/** Manuelle Freigabe (z. B. wenn die Report-Erstellung fehlschlägt). */
export async function releaseEmail(email: string): Promise<void> {
  const key = `report:email:${email.trim().toLowerCase()}`;
  if (!kvConfigured) {
    mem.delete(key);
    return;
  }
  try {
    await redis(["DEL", key]);
  } catch {
    /* egal */
  }
}

/**
 * Einfaches Sliding-Window-Rate-Limit via INCR + EX. Gibt true, wenn erlaubt.
 */
export async function rateLimit(scope: string, id: string, limit: number, windowSec: number): Promise<boolean> {
  const key = `rl:${scope}:${id}`;
  if (!kvConfigured) {
    const cur = parseInt(memGet(key) || "0", 10) + 1;
    mem.set(key, { value: String(cur), expires: Date.now() + windowSec * 1000 });
    return cur <= limit;
  }
  const count = await redis(["INCR", key]);
  if (count === 1) await redis(["EXPIRE", key, windowSec]);
  return count <= limit;
}
