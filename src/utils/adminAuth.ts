import { env } from "cloudflare:workers";

// Cryptographic hash token helper for edge compat
export async function hashToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "_tesca_admin_salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Authenticate session cookie
export async function checkAdminAuth(cookies: any): Promise<boolean> {
  const expectedPassword = env?.ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD || "admin1234";
  const sessionCookie = cookies.get("admin_session")?.value;
  const expectedHash = await hashToken(expectedPassword);
  return sessionCookie === expectedHash;
}
