// ───────────────────────────────────────────────────────────────────
// Bestand: vite.config.js
// Plaats: /<project-root>/vite.config.js
//───────────────────────────────────────────────────────────────────

import { defineConfig } from 'vite';
import react         from '@vitejs/plugin-react';
import path          from 'path';

export default defineConfig({
  // Zorg dat alle asset‑paths relatief worden ingeladen
  base: './',

  plugins: [react()],

  resolve: {
    alias: {
      // Handig voor imports: import Foo from 'src/components/Foo'
      src: path.resolve(__dirname, 'src'),
    },
  },
});
