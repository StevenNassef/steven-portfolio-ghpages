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
  },
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'lucide-icons': ['lucide-react'],
          'firebase-vendor': ['firebase/app', 'firebase/analytics'],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging (optional, can disable for smaller builds)
    sourcemap: false,
    // Minify using esbuild (faster and already included with Vite)
    minify: 'esbuild',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
  },
})
