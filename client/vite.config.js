import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig({
    plugins: [
        react(), // Убрана кастомная конфигурация Babel
        svgr({
            svgrOptions: {
                icon: true,
                svgoConfig: {
                    plugins: [
                        {
                            name: 'preset-default',
                            params: {
                                overrides: {
                                    removeViewBox: false,
                                },
                            },
                        },
                    ],
                },
            },
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@app': path.resolve(__dirname, './src/app'),
        },
    },
    server: {
        port: 3000,
        host: true,
        strictPort: true
    },
    preview: {
        port: 3000
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
          @use "@assets/styles/variables" as *;
          @use "@assets/styles/mixins" as *;
        `,
            },
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                },
            },
        },
    },
});