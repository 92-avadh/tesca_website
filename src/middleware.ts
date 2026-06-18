import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const runtime = (context.locals as any).runtime;
  const env = runtime?.env;
  
  if (env) {
    if (typeof process === 'undefined') {
      (globalThis as any).process = { env: {} };
    } else if (!process.env) {
      (process as any).env = {};
    }
    
    for (const [key, value] of Object.entries(env)) {
      if (typeof value === 'string') {
        process.env[key] = value;
      }
    }
  }
  
  return next();
});
