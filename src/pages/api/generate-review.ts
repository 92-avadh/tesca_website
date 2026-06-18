import type { APIRoute } from 'astro';
import { getEnv } from '../../utils/env';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const { country, visaType, experience } = body;

    const apiKey = getEnv("GROQ_API_KEY") || import.meta.env.GROQ_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GROQ_API_KEY is not configured in .env or secrets." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Prepare custom prompt details
    let details = "";
    if (country) details += `- Target Country: ${country}\n`;
    if (body.countryCode) details += `- Country Code: ${body.countryCode}\n`;
    if (visaType) details += `- Visa Type: ${visaType}\n`;
    if (experience) details += `- Student's Specific Experience: ${experience}\n`;

    const systemPrompt = `You are a Google Review writer. Write a natural, genuine Google review for "TESCA Visa Consultancy".

Strict Requirements:
- Length: 50-100 words.
- Sound human and authentic, not robotic or overly formal. Avoid cliché marketing speak or repetitive buzzwords.
- Mention professionalism, guidance, communication, and support naturally.
- Do not exaggerate, keep it positive but realistic.
- Do not mention AI, bots, or generators.
- Vary the sentence structures.
- Output ONLY the raw review text. Do not include quotes, intro, outro, title, or any helper text. Only output the review itself in English.`;

    const userPrompt = `Generate a review based on these details (if empty, generate a realistic general review):
${details || "Write a general positive and authentic student visa consultancy review."}`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.85,
        max_tokens: 150
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Groq API returned status ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const reviewText = data.choices?.[0]?.message?.content?.trim() || "";

    // The user requested: "Output only the review text"
    // So we can return it as plain text or JSON. Let's return it as JSON with { review: reviewText } and plain text if needed.
    return new Response(JSON.stringify({ review: reviewText }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    console.error("Generate Review error:", err);
    return new Response(JSON.stringify({ error: err.message || "Failed to generate review." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
