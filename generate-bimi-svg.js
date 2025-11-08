import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Generates a BIMI-compliant SVG from a profile image
 * BIMI requires SVG Tiny Portable/Secure format with no external references
 */
function generateBimiSvg(imagePath, outputPath) {
  try {
    // Read the image file
    const imageBuffer = readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64');
    
    // Determine MIME type based on file extension
    const ext = imagePath.toLowerCase().split('.').pop();
    let mimeType;
    if (ext === 'jpg' || ext === 'jpeg') {
      mimeType = 'image/jpeg';
    } else if (ext === 'png') {
      mimeType = 'image/png';
    } else {
      mimeType = 'image/jpeg'; // default
    }
    
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
  <!-- Optional border -->
  <circle cx="50" cy="50" r="50" fill="none" stroke="#333333" stroke-width="1"/>
</svg>`;
    
    // Write to output file
    writeFileSync(outputPath, svg, 'utf8');
    console.log(`✓ BIMI SVG generated successfully: ${outputPath}`);
    console.log(`  Image embedded as base64 (${Math.round(imageBuffer.length / 1024)}KB)`);
    
    return true;
  } catch (error) {
    console.error('Error generating BIMI SVG:', error.message);
    return false;
  }
}

// Generate BIMI SVG from profile.jpg
const profileImagePath = join(process.cwd(), 'public', 'profile', 'profile.jpg');
const outputSvgPath = join(process.cwd(), 'public', '.well-known', 'bimi-logo.svg');

generateBimiSvg(profileImagePath, outputSvgPath);

