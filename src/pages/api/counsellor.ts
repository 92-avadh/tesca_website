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
    const { firstName, lastName, email, phone, mode, destination } = body;

    if (!firstName || !lastName || !phone) {
      return new Response(JSON.stringify({ error: "Missing required fields (firstName, lastName, phone)." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const fullName = `${firstName} ${lastName}`;
    const detailsStr = JSON.stringify({ mode, destination });

    const result = await db.prepare(
      "INSERT INTO leads (lead_type, name, email, phone, details) VALUES (?, ?, ?, ?, ?)"
    ).bind("counsellor", fullName, email || null, phone, detailsStr).run();

    return new Response(JSON.stringify({
      success: true,
      leadId: result.meta?.last_row_id || null
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
