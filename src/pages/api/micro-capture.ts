import type { APIRoute } from 'astro';
import { supabase } from '../../utils/supabase';
import { validatePhone, sanitizeText } from '../../utils/validation';
import { getClientIP, checkRateLimit, jsonResponse, rateLimitResponse, rejectOversizedJson } from '../../utils/security';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 8;

export const POST: APIRoute = async ({ request }) => {
  const oversized = rejectOversizedJson(request);
  if (oversized) return oversized;

  const clientIP = getClientIP(request);
  if (await checkRateLimit(`micro-capture:${clientIP}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return rateLimitResponse();
  }

  let body: any = {};
  try {
    body = await request.json();
    const { phone, country, level } = body;

    // 1. Basic validation
    if (!phone) {
      return new Response(JSON.stringify({ error: "Phone number is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!validatePhone(phone)) {
      return new Response(JSON.stringify({ error: "Invalid phone number format." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Sanitization
    const cleanPhone = sanitizeText(phone, 20);
    const cleanCountry = country ? sanitizeText(country, 50) : "Unknown";
    const cleanLevel = level ? sanitizeText(level, 10) : "Unknown";

    const detailsStr = JSON.stringify({
      target_country: cleanCountry,
      study_level: cleanLevel,
      micro_captured_at: new Date().toISOString()
    });

    // 3. Save to Supabase leads table
    const { error: dbErr } = await supabase
      .from('leads')
      .insert({
        lead_type: 'eligibility_micro',
        name: 'Pending Profile',
        phone: cleanPhone,
        details: detailsStr
      });

    if (dbErr) {
      throw dbErr;
    }

    return jsonResponse({ success: true, message: "Micro-progress saved successfully." }, 200);

  } catch (err: any) {
    console.error("Micro-capture database failure:", err);
    return new Response(JSON.stringify({ error: "Database registration failed." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
