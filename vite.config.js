// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Een simpele plugin om de CSP header aan te passen voor de dev server
const cspPlugin = () => ({
  name: 'csp-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      res.setHeader(
          'Content-Security-Policy',
          // FIX: Voeg 'connect-src' toe om API-calls naar de backend toe te staan.
          // Zorg ervoor dat de URL hier overeenkomt met je VITE_API_URL.
          "default-src 'self'; " +
          "connect-src 'self' http://localhost:8000; " +
          "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
          "style-src 'self' 'unsafe-inline'; " +
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