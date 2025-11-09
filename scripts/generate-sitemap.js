/**
 * Generates sitemap.xml for the portfolio website
 * Run this script before building: node scripts/generate-sitemap.js
 */

import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read projects data from the source file
// Since we can't directly import JSX, we'll extract project keys from the file
const projectsDataFile = join(__dirname, '../src/projectsData.js');
const projectsDataContent = readFileSync(projectsDataFile, 'utf8');

// Extract project keys using regex
const projectKeyMatches = projectsDataContent.match(/key:\s*"([^"]+)"/g);
const projectKeys = projectKeyMatches 
  ? projectKeyMatches.map(match => match.match(/"([^"]+)"/)[1])
  : ['mergedom', 'kortifo', 'cairo_invaiders', 'zarzura', 'coin_forge', 'rent_lord', 'rocket_factory', 'jumpy_shooter'];

const SITE_URL = 'https://www.stevennassef.com';
const PUBLIC_DIR = join(__dirname, '..', 'public');
const OUTPUT_FILE = join(PUBLIC_DIR, 'sitemap.xml');

// Get current date in ISO format
const currentDate = new Date().toISOString().split('T')[0];

// Generate URLs
const urls = [
  {
    loc: SITE_URL,
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: '1.0'
  },
  {
    loc: `${SITE_URL}/#projects`,
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: '0.9'
  },
  {
    loc: `${SITE_URL}/#experience`,
    lastmod: currentDate,
    changefreq: 'monthly',
    priority: '0.8'
  },
  {
    loc: `${SITE_URL}/#skills`,
    lastmod: currentDate,
    changefreq: 'monthly',
    priority: '0.7'
  },
  {
    loc: `${SITE_URL}/#contact`,
    lastmod: currentDate,
    changefreq: 'monthly',
    priority: '0.7'
  },
  // Add project URLs
  ...projectKeys.map(key => ({
    loc: `${SITE_URL}/#/project/${encodeURIComponent(key)}`,
    lastmod: currentDate,
    changefreq: 'monthly',
    priority: '0.8'
  }))
];

// Generate XML
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(url => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

// Helper function to escape XML special characters
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Write sitemap.xml to public directory
try {
  writeFileSync(OUTPUT_FILE, xml, 'utf8');
  console.log(`✅ Sitemap generated successfully: ${OUTPUT_FILE}`);
  console.log(`   Total URLs: ${urls.length}`);
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
}

