import { vitePreprocess } from '@sveltejs/kit/vite'
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
  },

  onwarn: (warning, handler) => {
    if (warning.code.startsWith('a11y-click-events-have-key-events')) {
      return
    }
    if (warning.message.includes(`'_' is defined but never used`)) {
      return
    }
    if (warning.message.includes(`has unused export property 'data'`)) {
      return
    }
    handler(warning)
  },
}

export default config
