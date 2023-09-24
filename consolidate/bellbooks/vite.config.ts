import { sveltekit } from '@sveltejs/kit/vite'
import { SvelteKitPWA } from '@vite-pwa/sveltekit'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [sveltekit(), SvelteKitPWA()],
  resolve: {
    alias: {
      $assets: resolve('./src/lib/assets'),
      $components: resolve('./src/lib/components'),
      $data: resolve('./src/lib/data'),
      $db: resolve('./src/db'),
      $features: resolve('./src/lib/features'),
      $models: resolve('./src/lib/models'),
      $services: resolve('./src/lib/services'),
      $stores: resolve('./src/lib/stores'),
      $util: resolve('./src/lib/util'),
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
})
