import fs from 'fs';
import path from 'path';

const rootDir = 'c:\\Users\\dhame\\Desktop\\tesca_website';
const srcDir = path.join(rootDir, 'src');
const publicDir = path.join(rootDir, 'public');

// Recursively get files in a directory
function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allSrcFiles = getFiles(srcDir).filter(f => f.endsWith('.astro') || f.endsWith('.tsx') || f.endsWith('.ts'));

const imagesFound = new Set();
const materialsFound = new Set();
const internalLinks = new Set();

// Regular expressions to find static assets and links
const staticAssetRegex = /"(\/(?:images|bank|material)\/[^"]+)"|'(\/(?:images|bank|material)\/[^']+)'|`(\/(?:images|bank|material)\/[^`]+)`/g;
const hrefRegex = /href=["'](\/[^"']*)["']/g;

for (const file of allSrcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  
  // Find static assets
  while ((match = staticAssetRegex.exec(content)) !== null) {
    const assetPath = match[1] || match[2] || match[3];
    if (assetPath.startsWith('/images/')) imagesFound.add({ path: assetPath, sourceFile: file });
    else if (assetPath.startsWith('/bank/')) imagesFound.add({ path: assetPath, sourceFile: file });
    else if (assetPath.startsWith('/material/')) materialsFound.add({ path: assetPath, sourceFile: file });
  }

  // Find internal links
  while ((match = hrefRegex.exec(content)) !== null) {
    const link = match[1];
    // Ignore external URLs, hashes, tel, mailto, whatsapp
    if (!link.startsWith('http') && !link.startsWith('#') && !link.startsWith('tel:') && !link.startsWith('mailto:') && !link.startsWith('https://wa.me')) {
      internalLinks.add({ path: link, sourceFile: file });
    }
  }
}

console.log('=== VERIFYING STATIC ASSETS ===');
let brokenAssets = 0;
const checkedAssets = new Set();

const checkAsset = (asset, sourceFile) => {
  if (checkedAssets.has(asset)) return;
  checkedAssets.add(asset);
  
  // Clean up potential query strings or hash
  const cleanPath = asset.split('?')[0].split('#')[0];
  const fullPath = path.join(publicDir, cleanPath.replace(/\//g, path.sep));
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ BROKEN ASSET: ${asset} referenced in ${path.relative(rootDir, sourceFile)}`);
    brokenAssets++;
  }
};

for (const { path: asset, sourceFile } of imagesFound) {
  checkAsset(asset, sourceFile);
}
for (const { path: asset, sourceFile } of materialsFound) {
  checkAsset(asset, sourceFile);
}

console.log(`Total broken static assets found: ${brokenAssets}`);

console.log('\n=== VERIFYING INTERNAL PAGE LINKS ===');
let brokenLinks = 0;
const checkedLinks = new Set();

const checkLink = (linkPath, sourceFile) => {
  if (checkedLinks.has(linkPath)) return;
  checkedLinks.add(linkPath);

  const cleanPath = linkPath.split('?')[0].split('#')[0];
  if (cleanPath === '/' || cleanPath === '') return;

  // Let's see if this page exists in src/pages
  // Example: /countries -> src/pages/countries.astro
  // /services/admission -> src/pages/services/[slug].astro or src/pages/services/admission.astro
  let exists = false;
  
  const possibleFiles = [
    path.join(srcDir, 'pages', cleanPath + '.astro'),
    path.join(srcDir, 'pages', cleanPath, 'index.astro'),
  ];

  for (const f of possibleFiles) {
    if (fs.existsSync(f)) {
      exists = true;
      break;
    }
  }

  // Handle dynamic routing
  if (!exists) {
    if (cleanPath.startsWith('/services/')) {
      const slug = cleanPath.substring('/services/'.length);
      // check if it exists in SERVICES
      // Since we don't import services TS file easily, we can check if it matches a hardcoded check or we can parse it from data/services.ts
      // For now, let's check if [slug].astro exists
      if (fs.existsSync(path.join(srcDir, 'pages', 'services', '[slug].astro'))) {
        // Assume dynamic route exists. Later we can verify details.
        exists = true;
      }
    }
  }

  if (!exists) {
    console.log(`❌ BROKEN LINK: ${linkPath} referenced in ${path.relative(rootDir, sourceFile)}`);
    brokenLinks++;
  }
};

for (const { path: link, sourceFile } of internalLinks) {
  checkLink(link, sourceFile);
}

console.log(`Total broken internal links found: ${brokenLinks}`);
