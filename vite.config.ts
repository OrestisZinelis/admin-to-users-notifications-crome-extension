import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import unoCSS from 'unocss/vite'
import presetUno from '@unocss/preset-uno'
import presetRemToPx from '@unocss/preset-rem-to-px'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    unoCSS({
      presets: [presetUno(), presetRemToPx()]
    })
  ],
  build: {
    rollupOptions: {
      input: {
        background: 'src/assets/background.ts',
        popup: 'src/popup/main.ts',
        options: 'src/options/main.ts'
      },

      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
