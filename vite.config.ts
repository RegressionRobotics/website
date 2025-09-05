import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'about.html',
        contact: 'contact.html',
        donate: 'donate.html',
        season: 'season.html',
        sponsors: 'sponsors.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
