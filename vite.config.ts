import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages needs /HandshakeAuto/ base in CI
  // In dev (localhost) this is automatically '/'
  base: process.env.VITE_PAGES_BASE === 'true' ? '/HandshakeAuto/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
