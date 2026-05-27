import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin() // Safely inlines 10.8KB CSS into index.js
  ],
  build: {
    minify: 'terser', // Optimizes chunk compression
    terserOptions: {
      compress: {
        drop_console: true, // Drops console logs for production speed
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        // Prevents deep nested directory asset structures
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    }
  }
});
