import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'
import { join } from 'path'

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

export default defineConfig({
  plugins: [react(), copy404Plugin()],
  base,
  server: {
    host: true, // Listen on all local IPs so your iPhone can access it
    port: 5173, // You can change the port if needed, default is 5173
    strictPort: false, // Allows Vite to use a different port if 5173 is busy
  }
})
