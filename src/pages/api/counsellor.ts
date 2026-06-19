import type { APIRoute } from 'astro';
import { supabase } from '../../utils/supabase';
import { validateEmail, validatePhone, validateName, sanitizeText } from '../../utils/validation';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, mode, destination } = body;

    // 1. Basic check for presence
    if (!firstName || !lastName || !phone) {
      return new Response(JSON.stringify({ error: "Missing required fields (firstName, lastName, phone)." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Strict format & length validation
    if (!validateName(firstName) || !validateName(lastName)) {
      return new Response(JSON.stringify({ error: "Invalid name format or length (max 100 characters)." }), {
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

    if (email && !validateEmail(email)) {
      return new Response(JSON.stringify({ error: "Invalid email address format." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 3. Sanitization
    const cleanFirstName = sanitizeText(firstName, 100);
    const cleanLastName = sanitizeText(lastName, 100);
    const cleanEmail = email ? sanitizeText(email, 254).toLowerCase() : null;
    const cleanPhone = sanitizeText(phone, 20);
    const cleanMode = mode ? sanitizeText(mode, 50) : "";
    const cleanDestination = destination ? sanitizeText(destination, 50) : "";

    const fullName = `${cleanFirstName} ${cleanLastName}`;
    const detailsStr = JSON.stringify({ mode: cleanMode, destination: cleanDestination });

    const { data: insertedData, error } = await supabase
      .from('leads')
      .insert({
        lead_type: 'counsellor',
        name: fullName,
        email: cleanEmail,
        phone: cleanPhone,
        details: detailsStr,
        status: 'pending'
      })
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({
      success: true,
      leadId: insertedData?.id || null
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    console.error("Counsellor API error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

