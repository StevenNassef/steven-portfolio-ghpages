import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

const base = '/'

// Plugin to copy index.html to 404.html for GitHub Pages SPA routing
const copy404Plugin = () => {
  return {
    name: 'copy-404',
    writeBundle() {
      const outDir = join(process.cwd(), 'dist')
      copyFileSync(join(outDir, 'index.html'), join(outDir, '404.html'))
    }
  }
}

// Plugin to generate sitemap and copy robots.txt
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
    }
  }
}

export default defineConfig({
  plugins: [react(), copy404Plugin(), seoPlugin()],
  base,
  server: {
    host: true, // Listen on all local IPs so your iPhone can access it
    port: 5173, // You can change the port if needed, default is 5173
    strictPort: false, // Allows Vite to use a different port if 5173 is busy
  }
})
