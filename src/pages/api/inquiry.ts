import type { APIRoute } from 'astro';
import { env } from "cloudflare:workers";

export const POST: APIRoute = async ({ request }) => {
  try {
    const db = env?.tesca_db || env?.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: "Database connection not available." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const body = await request.json();
    const { fullName, email, mobileNumber } = body;

    if (!fullName || !mobileNumber) {
      return new Response(JSON.stringify({ error: "Missing required fields (fullName, mobileNumber)." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const detailsStr = JSON.stringify(body);

    const result = await db.prepare(
      "INSERT INTO leads (lead_type, name, email, phone, details) VALUES (?, ?, ?, ?, ?)"
    ).bind("inquiry", fullName, email || null, mobileNumber, detailsStr).run();

    return new Response(JSON.stringify({
      success: true,
      leadId: result.meta?.last_row_id || null
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
