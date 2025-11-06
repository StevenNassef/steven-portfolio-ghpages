import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const base = '/'
export default defineConfig({
  plugins: [react()],
  base,
  server: {
    host: true, // Listen on all local IPs so your iPhone can access it
    port: 5173, // You can change the port if needed, default is 5173
    strictPort: false, // Allows Vite to use a different port if 5173 is busy
  }
})
