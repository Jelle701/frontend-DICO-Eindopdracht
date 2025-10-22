import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';



const cspPlugin = () => ({
    name: 'csp-plugin',
    configureServer(server) {
        server.middlewares.use((req, res, next) => {
            res.setHeader(
                'Content-Security-Policy',
                "default-src 'self'; connect-src 'self' http://localhost:8000 http://localhost:3000; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:;"
            );
            next();
        });
    },
});

export default defineConfig(({ command }) => ({
    plugins: [react(), ...(command === 'serve' ? [cspPlugin()] : [])],
    base: './',   // ← verander dit!
    server: {
        proxy: { '/api': { target: 'http://localhost:8000', changeOrigin: true } },
    },
    build: {
        sourcemap: true,
    },
}));