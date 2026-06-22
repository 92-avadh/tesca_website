import { defineMiddleware } from "astro:middleware";
import { setRuntimeEnv } from "./utils/env";

export const onRequest = defineMiddleware(async (_context, next) => {
  try {
    const { env } = await import("cloudflare:workers");
    if (env) {
      setRuntimeEnv(env);
    }
  } catch (e) {
    // Fallback/ignore during local development or build time
  }
  
  const response = await next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), geolocation=(), payment=(), usb=()");
  return response;
});
