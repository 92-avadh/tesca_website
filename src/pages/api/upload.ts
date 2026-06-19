import type { APIRoute } from 'astro';
import { env } from "cloudflare:workers";
import { getEnv } from '../../utils/env';
import { checkAdminAuth } from '../../utils/adminAuth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // 1. Authenticate Request
    const isAuthenticated = await checkAdminAuth(cookies);
    if (!isAuthenticated) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401, 
        headers: { "Content-Type": "application/json" }
      });
    }

    const bucket = env?.R2_BUCKET;
    if (!bucket) {
      return new Response(JSON.stringify({ error: "Storage binding not available." }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file || file.size === 0) {
      return new Response(JSON.stringify({ error: "No file provided" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Validate file type and extension (JPG, JPEG, PNG only)
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    if (!["jpg", "jpeg", "png"].includes(ext) || !["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      return new Response(JSON.stringify({ error: "Only JPEG, JPG, and PNG images are allowed." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Check size (e.g. 5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "File size exceeds 5MB limit" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Generate unique filename
    const key = `uploads/${crypto.randomUUID()}.${ext}`;

    // Upload to Cloudflare R2
    const buffer = await file.arrayBuffer();
    await bucket.put(key, buffer, {
      httpMetadata: { contentType: file.type }
    });

    // Generate public URL using config, falling back to local proxy API
    const r2PublicUrl = getEnv('R2_PUBLIC_URL') || import.meta.env.R2_PUBLIC_URL;
    const publicUrl = r2PublicUrl ? `${r2PublicUrl.replace(/\/$/, '')}/${key}` : `/api/assets?key=${key}`;

    return new Response(JSON.stringify({ success: true, url: publicUrl }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    console.error("Upload API error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server upload error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
