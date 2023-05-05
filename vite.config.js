import { sveltekit } from '@sveltejs/kit/vite'
import { resolve } from 'path'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $assets: resolve('./src/lib/assets'),
      $components: resolve('./src/lib/components'),
      $models: resolve('./src/lib/models'),
      $services: resolve('./src/lib/services'),
      $stores: resolve('./src/lib/stores'),
      $util: resolve('./src/lib/util')
    }
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
}

export default config
