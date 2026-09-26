/**
 * Konfigurasi URL API Backend.
 * - Jika NEXT_PUBLIC_BACKEND_URL diset (misal: 'http://localhost:5000'),
 *   frontend akan memanggil Node.js Express Backend terpisah.
 * - Jika tidak diset / kosong, frontend akan memanggil Next.js API Routes internal ('/api/...').
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  // Jika API_BASE_URL kosong, gunakan path relatif bawaan Next.js
  if (!API_BASE_URL) {
    return cleanEndpoint;
  }
  // Hapus trailing slash jika ada
  const cleanBase = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;
  return `${cleanBase}${cleanEndpoint}`;
}
