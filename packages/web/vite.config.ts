import path from 'node:path';

import react from '@vitejs/plugin-react-swc';
import { CodeInspectorPlugin } from 'code-inspector-plugin';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      plugins: [['@swc/plugin-emotion', {}]],
    }),
    svgr(),
    CodeInspectorPlugin({
      bundler: 'vite',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          antd: ['antd', '@ant-design/icons'],
          dexie: ['dexie', 'dexie-react-hooks', 'dexie-export-import'],
          slate: ['slate', 'slate-history', 'slate-react'],
          faker: ['@faker-js/faker'],
          i18n: ['i18next', 'i18next-browser-languagedetector', 'i18next-http-backend', 'react-i18next'],
        },
      },
    },
  },
});
