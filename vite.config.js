import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync, writeFileSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

const base = '/'

// Plugin to add cache-control meta tags and build timestamp to HTML
// IMPORTANT: These meta tags ONLY affect the HTML file, not assets (images, videos, etc.)
// Assets are cached separately by the browser based on GitHub Pages HTTP headers
// - HTML: Not cached (so users get latest version)
// - JS/CSS: Content-hashed by Vite (new filename = new download, same filename = cached)
// - Images/Videos: Cached by browser (same URL = uses cache, unless server says otherwise)
const cacheControlPlugin = () => {
  return {
    name: 'cache-control',
    transformIndexHtml(html) {
      // Generate fresh timestamp for each build to ensure HTML content changes
      const buildTimestamp = Date.now()
      
      // Use "no-cache" (revalidate) instead of "no-store" (don't cache at all)
      // This tells browser: "You can cache, but check with server first"
      // Combined with build timestamp, ensures users get latest HTML
      const cacheControlMeta = `
    <!-- Cache Control - HTML only (does NOT affect images/videos/assets) -->
    <meta http-equiv="Cache-Control" content="no-cache, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <meta name="build-timestamp" content="${buildTimestamp}" />
    <!-- Build: ${buildTimestamp} -->`
      
      // Insert before closing head tag (only if </head> exists)
      if (html.includes('</head>')) {
        html = html.replace('</head>', `${cacheControlMeta}\n  </head>`)
      }
      
      // Add build timestamp to body to ensure HTML content changes on each build
      // This helps browsers recognize the file has changed even if structure is similar
      if (html.includes('<body')) {
        html = html.replace('<body', `<body data-build="${buildTimestamp}"`)
      }
      
      return html
    }
  }
}

// Plugin to copy index.html to 404.html for GitHub Pages SPA routing
// This enables client-side routing to work on GitHub Pages (all routes serve index.html)
// Note: Runs after cacheControlPlugin, so index.html already has cache-control tags
const copy404Plugin = () => {
  return {
    name: 'copy-404',
    writeBundle() {
      const outDir = join(process.cwd(), 'dist')
      const indexPath = join(outDir, 'index.html')
      const html404Path = join(outDir, '404.html')
      
      if (existsSync(indexPath)) {
        try {
          // Copy index.html to 404.html (cache-control tags are already in index.html)
          copyFileSync(indexPath, html404Path)
        } catch (error) {
          console.warn('Failed to copy index.html to 404.html:', error.message)
        }
      } else {
        console.warn('index.html not found in dist directory')
      }
    }
  }
}

// Plugin to generate sitemap, copy robots.txt, and create .nojekyll
const seoPlugin = () => {
  return {
    name: 'seo-plugin',
    buildStart() {
      // Generate sitemap before build
      try {
        execSync('node scripts/generate-sitemap.js', { stdio: 'inherit' })
      } catch (error) {
        console.warn('Failed to generate sitemap:', error.message)
      }
    },
    writeBundle() {
      const outDir = join(process.cwd(), 'dist')
      const publicDir = join(process.cwd(), 'public')
      
      // Copy sitemap.xml if it exists
      const sitemapSrc = join(publicDir, 'sitemap.xml')
      if (existsSync(sitemapSrc)) {
        copyFileSync(sitemapSrc, join(outDir, 'sitemap.xml'))
      }
      
      // Copy robots.txt if it exists
      const robotsSrc = join(publicDir, 'robots.txt')
      if (existsSync(robotsSrc)) {
        copyFileSync(robotsSrc, join(outDir, 'robots.txt'))
      }
      
      // Always create .nojekyll file to ensure GitHub Pages serves all files correctly
      // This prevents Jekyll processing and ensures proper static file serving
      // Important for files starting with underscore, dot-files, and proper caching
      try {
        const nojekyllPath = join(outDir, '.nojekyll')
        writeFileSync(nojekyllPath, '')
      } catch (error) {
        console.warn('Failed to create .nojekyll file:', error.message)
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), cacheControlPlugin(), copy404Plugin(), seoPlugin()],
  base,
  server: {
    host: true, // Listen on all local IPs so your iPhone can access it
    port: 5173, // You can change the port if needed, default is 5173
    strictPort: false, // Allows Vite to use a different port if 5173 is busy
  },
  // Note: Vite automatically handles asset hashing for cache busting by default
  // JS/CSS files get content-based hashes in their filenames (e.g., index-3N7hiEMf.js)
  // No manual configuration needed - this is Vite's default behavior
})
