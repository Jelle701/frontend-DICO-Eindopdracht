/**
 * @file vite.config.js
 * @description This file contains the configuration for Vite, the build tool used for this project.
 * It sets up the necessary plugins for React development and includes a custom plugin to configure
 * Content Security Policy (CSP) headers for the development server.
 *
 * @module ViteConfig
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * A custom Vite plugin to set the Content-Security-Policy (CSP) header for the development server.
 * This is a security measure to control which resources (scripts, styles, fonts, etc.) the browser is allowed to load.
 * @returns {object} A Vite plugin object with a `configureServer` hook.
 */
const cspPlugin = () => ({
  name: 'csp-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      res.setHeader(
          'Content-Security-Policy',
          // Defines the default source for all resources to be the same origin.
          "default-src 'self'; " +
          // Allows API connections to the app's own origin and the backend server.
          "connect-src 'self' http://localhost:8000 http://localhost:3000; " +
          // Allows scripts from the same origin, and allows 'unsafe-eval' and 'unsafe-inline' which are often needed for development tools and hot-reloading.
          "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
          // Allows stylesheets from the same origin, inline styles, and from Google Fonts.
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
          // Allows fonts to be loaded from the same origin and from Google Fonts' static domain.
          "font-src 'self' https://fonts.gstatic.com; " +
          // Allows images from the same origin and from data: URIs.
          "img-src 'self' data:;"
      );
      next();
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Enables React support in Vite (e.g., JSX transformation, Fast Refresh).
    react(),
    // Adds the custom CSP plugin to the development server.
    cspPlugin(),
  ],
});
