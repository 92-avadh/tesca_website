import type { APIRoute } from 'astro';
import { supabase } from '../../utils/supabase';
import { validateEmail, validatePhone, validateName, sanitizeText } from '../../utils/validation';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { fullName, email, mobileNumber, message, subject } = body;

    // 1. Basic check for presence
    if (!fullName || !mobileNumber) {
      return new Response(JSON.stringify({ error: "Missing required fields (fullName, mobileNumber)." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Strict format & length validation
    if (!validateName(fullName, 200)) {
      return new Response(JSON.stringify({ error: "Invalid name format or length (max 200 characters)." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!validatePhone(mobileNumber)) {
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
    const cleanFullName = sanitizeText(fullName, 200);
    const cleanEmail = email ? sanitizeText(email, 254).toLowerCase() : null;
    const cleanMobile = sanitizeText(mobileNumber, 20);
    
    // Safely whitelist details fields to prevent arbitrary JSON manipulation
    const cleanDetails = {
      fullName: cleanFullName,
      email: cleanEmail,
      mobileNumber: cleanMobile,
      message: message ? sanitizeText(message, 1000) : undefined,
      subject: subject ? sanitizeText(subject, 200) : undefined
    };
    const detailsStr = JSON.stringify(cleanDetails);

    const { data: insertedData, error } = await supabase
      .from('leads')
      .insert({
        lead_type: 'inquiry',
        name: cleanFullName,
        email: cleanEmail,
        phone: cleanMobile,
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
    console.error("Inquiry API error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

