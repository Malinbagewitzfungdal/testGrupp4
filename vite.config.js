import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true, // Gör att du kan använda expect utan att importera det i varje fil
    setupFiles: '././src/test/setup.js' // valfritt om du vill importera jest-dom globalt
  },
})
