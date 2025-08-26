import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,        // يسمح بالاتصال من أي IP
    port: 5173,        // المنفذ المحلي
    strictPort: false, // لو المنفذ مش فاضي، هيجيب واحد جديد
    allowedHosts: [
      '.ngrok-free.app',   // السماح بدومينات ngrok
      '.tunnelmole.net',   // السماح بدومينات Tunnelmole
      'localhost'
    ],
    proxy: {
      '/api': {
        target: 'http://95.216.63.80:255', // API السيرفر
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            // removed console logging in production-ready config
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // الحفاظ على Content-Type لو فيه FormData
            if (req.headers['content-type']?.includes('multipart/form-data')) {
              proxyReq.setHeader('Content-Type', req.headers['content-type']);
            }
          });
          proxy.on('proxyRes', (_proxyRes, _req, _res) => {
            // removed console logging in production-ready config
          });
        },
      },
    },
    hmr: false // <- مهم: إيقاف HMR لتجنب مشاكل WebSocket عبر HTTPS/Tunnel
  },
  build: {
    // Drop all console.* and debugger statements in production build
    esbuild: {
      drop: ['console', 'debugger']
    }
  }
})
