import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rolldownOptions: {
      output: {
        codeSplitting: {
          minSize: 20000,
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\/](?:react|react-dom|react-router-dom|scheduler)[\\/]/,
              priority: 30,
            },
            {
              name: 'three-core',
              test: /node_modules[\\/]three[\\/]/,
              priority: 25,
            },
            {
              name: 'three-react',
              test: /node_modules[\\/](?:@react-three|three-stdlib|maath|troika|suspend-react)[\\/]/,
              priority: 20,
            },
            {
              name: 'ui-vendor',
              test: /node_modules[\\/](?:lucide-react|vaul|sonner|zustand|@radix-ui)[\\/]/,
              priority: 15,
            },
          ],
        },
      },
    },
  },
});
