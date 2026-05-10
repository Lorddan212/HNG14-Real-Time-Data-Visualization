import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ['echarts', 'vue-echarts'],
          table: ['@tanstack/vue-table'],
          vue: ['vue', 'vue-router', 'pinia'],
          icons: ['lucide-vue-next'],
        },
      },
    },
  },
});
