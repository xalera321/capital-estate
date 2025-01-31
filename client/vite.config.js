import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
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
            '@styles': path.resolve(__dirname, './src/assets/styles'),
        },
    },
    server: {
        port: 5173,
        host: true,
        strictPort: true
    },
    preview: {
        port: 5173
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
        @use "@styles/variables" as *;
        @use "@styles/mixins" as *;
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