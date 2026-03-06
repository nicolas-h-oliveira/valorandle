import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    allowedHosts: true, // Autorise l'accès via Localtunnel
    host: true          // Active le mode network par défaut
  }
})