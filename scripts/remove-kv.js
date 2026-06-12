import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'dist', 'client', 'wrangler.json');
if (fs.existsSync(filePath)) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    
    // Remove KV namespaces to prevent wrangler from trying to auto-provision them
    if (data.kv_namespaces) {
      delete data.kv_namespaces;
    }
    if (data.previews && data.previews.kv_namespaces) {
      delete data.previews.kv_namespaces;
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log('[Post-build] Successfully removed KV namespaces from wrangler.json');
  } catch (err) {
    console.error('[Post-build] Failed to process wrangler.json:', err);
  }
} else {
  console.log('[Post-build] wrangler.json not found at:', filePath);
}
