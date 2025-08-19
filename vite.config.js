// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Aangepaste plugin om de CSP header correct in te stellen voor de dev server
const cspPlugin = () => ({
  name: 'csp-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      res.setHeader(
          'Content-Security-Policy',
          "default-src 'self'; " +
          // CORRECTED: Toestaan van API-calls naar de backend op de juiste poorten
          "connect-src 'self' http://localhost:8000 http://localhost:3000; " +
          "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
          // Toestaan van stylesheets van Google Fonts
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
          // Toestaan van lettertypes van Google Fonts
          "font-src 'self' https://fonts.gstatic.com; " +
          "img-src 'self' data:;"
      );
      next();
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Voeg onze custom plugin toe
    cspPlugin(),
  ],
});