import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@public': path.resolve(__dirname, 'public')
    }
  }
}) 