import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import svgr from 'vite-plugin-svgr'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), chunkSplitPlugin()],
  css: {
    preprocessorOptions: {
      scss: { additionalData: `@import "./src/styles/index";` },
    },
  },
  resolve: {
    alias: {
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@cmpnnts': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
    },
  },
})
