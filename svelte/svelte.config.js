import adapter from '@sveltejs/adapter-node'
import preprocess from 'svelte-preprocess'
import { resolve } from 'path'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter({ out: 'build' }),
    vite: {
      resolve: {
        alias: {
          $assets: resolve('./src/lib/assets'),
          $components: resolve('./src/lib/components'),
          $models: resolve('./src/lib/models'),
          $services: resolve('./src/lib/services'),
          $stores: resolve('./src/lib/stores'),
          $util: resolve('./src/lib/util')
        }
      }
    }
  }
}

export default config
