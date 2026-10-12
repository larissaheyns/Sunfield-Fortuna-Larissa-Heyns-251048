// In dev, Vite proxies /api to the backend (see vite.config.js).
// In production set VITE_API_URL (e.g. https://api.yourdomain.org/api) at build time.
const BASE = import.meta.env.VITE_API_URL || "/api";

export async function api(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data;
}
