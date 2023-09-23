<script lang="ts">
  import { onMount } from 'svelte'
  import { pwaInfo } from 'virtual:pwa-info'

  onMount(async () => {
    if (pwaInfo) {
      const { registerSW } = await import('virtual:pwa-register')
      registerSW({
        immediate: true,
        onRegistered(r) {
          // uncomment following code if you want check for updates
          // r && setInterval(() => {
          //    console.log('Checking for sw update')
          //    r.update()
          // }, 3000 /* 3s for testing purposes */)
          console.log(`SW Registered: ${r}`)
        },
        onRegisterError(error) {
          console.log('SW registration error', error)
        },
      })
    }
  })

  $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : ''
</script>

<svelte:head>
  {@html webManifestLink}
  <title>BellBooks</title>
</svelte:head>

<slot />

{#await import('$features/pwa/reload-prompt.svelte') then { default: ReloadPrompt }}
  <ReloadPrompt />
{/await}
