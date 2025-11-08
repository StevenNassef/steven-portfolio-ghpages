import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/**
 * Generates a BIMI-compliant SVG from a profile image with optimization
 * BIMI requires SVG to be under 32KB
 */
async function generateBimiSvgOptimized(imagePath, outputPath) {
  try {
    let imageBuffer;
    let mimeType = 'image/jpeg';
    
    // Try to use sharp for optimization if available
    try {
      const sharp = require('sharp');
      console.log('Using sharp for image optimization...');
      
      // Resize to 200x200 (BIMI logos are typically small)
      // Use high quality but optimize for size
      imageBuffer = await sharp(imagePath)
        .resize(200, 200, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({
          quality: 85,
          mozjpeg: true
        })
        .toBuffer();
      
      mimeType = 'image/jpeg';
      console.log(`✓ Image optimized: ${Math.round(imageBuffer.length / 1024)}KB`);
    } catch (sharpError) {
      // Fallback: use original image (might be too large)
      console.log('Sharp not available, using original image (may be too large for BIMI)...');
      imageBuffer = readFileSync(imagePath);
      
      const ext = imagePath.toLowerCase().split('.').pop();
      if (ext === 'png') {
        mimeType = 'image/png';
      }
    }
    
    // Convert to base64
    const imageBase64 = imageBuffer.toString('base64');
    
    // Create BIMI-compliant SVG
    // BIMI requires SVG Tiny Portable/Secure format
    // Must be square, self-contained (no external references)
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <defs>
    <clipPath id="circleClip">
      <circle cx="50" cy="50" r="50"/>
    </clipPath>
  </defs>
  <!-- Background circle -->
  <circle cx="50" cy="50" r="50" fill="#e0e0e0"/>
  <!-- Embedded profile image as base64 -->
  <image href="data:${mimeType};base64,${imageBase64}" 
         x="0" y="0" 
         width="100" height="100" 
         clip-path="url(#circleClip)"
         preserveAspectRatio="xMidYMid slice"/>
</svg>`;
    
    // Write to output file
    writeFileSync(outputPath, svg, 'utf8');
    
    const svgSize = Buffer.from(svg).length;
    const svgSizeKB = Math.round(svgSize / 1024);
    
    console.log(`✓ BIMI SVG generated successfully: ${outputPath}`);
    console.log(`  SVG size: ${svgSizeKB}KB ${svgSizeKB > 32 ? '⚠️  (EXCEEDS 32KB LIMIT - may not work with all email clients)' : '✓ (within 32KB limit)'}`);
    
    if (svgSizeKB > 32) {
      console.log(`\n⚠️  WARNING: SVG is ${svgSizeKB}KB, which exceeds the recommended 32KB limit.`);
      console.log(`   Consider:`);
      console.log(`   1. Installing sharp: npm install sharp`);
      console.log(`   2. Using a smaller source image`);
      console.log(`   3. Further reducing image quality`);
    }
    
    return true;
  } catch (error) {
    console.error('Error generating BIMI SVG:', error.message);
    return false;
  }
}

// Generate BIMI SVG from profile.jpg
const profileImagePath = join(process.cwd(), 'public', 'profile', 'profile.jpg');
const outputSvgPath = join(process.cwd(), 'public', '.well-known', 'bimi-logo.svg');

generateBimiSvgOptimized(profileImagePath, outputSvgPath);

