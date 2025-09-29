import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  server: {
    port: 5175
  },
  // base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
=======
  // base: '/',
>>>>>>> 23ecef7f2d77187b165bee91051cef88a79a0940
})
