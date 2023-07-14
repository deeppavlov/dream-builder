import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'
import svgr from 'vite-plugin-svgr'
import topLevelAwait from 'vite-plugin-top-level-await'
import wasm from 'vite-plugin-wasm'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    chunkSplitPlugin(),
    wasm(),
    topLevelAwait(),
    tsconfigPaths(),
    // Handle cyclic dependencies
    {
      name: 'singleHMR',
      handleHotUpdate({ modules }) {
        modules.map(m => {
          m.importedModules = new Set()
          m.importers = new Set()
        })
        return modules
      },
    },
  ],

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
