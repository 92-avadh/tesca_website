type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();
let cleanupCounter = 0;

export function getClientIP(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  cleanupCounter++;
  if (cleanupCounter >= 100) {
    cleanupCounter = 0;
    for (const [storedKey, storedEntry] of rateLimitStore) {
      if (now > storedEntry.resetAt) {
        rateLimitStore.delete(storedKey);
      }
    }
  }

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count++;
  return entry.count > max;
}

export function jsonResponse(body: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

export function genericApiError(): Response {
  return jsonResponse({ error: "Unable to process request. Please try again later." }, 500);
}

export function rejectOversizedJson(request: Request, maxBytes = 64 * 1024): Response | null {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > maxBytes) {
    return jsonResponse({ error: "Request body is too large." }, 413);
  }
  return null;
}

export function rateLimitResponse(): Response {
  return jsonResponse({ error: "Too many requests. Please try again later." }, 429, {
    "Retry-After": "60",
  });
}
