import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import appengine from 'svelte-adapter-appengine'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: appengine(),

    alias: {
      $api: './src/lib/api',
      $assets: './src/lib/assets',
      $components: './src/lib/components',
      $features: './src/lib/features',
      $util: './src/lib/util',

      // TODO @cocowmn: all aliases below this line should be deleted once they are no longer in use
      $data: './src/lib/data',
      $models: './src/lib/models',
      $services: './src/lib/services',
      $stores: './src/lib/stores',
    },
  },
}

export default config
