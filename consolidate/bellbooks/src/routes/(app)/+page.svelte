<script lang="ts">
  import { navbarController } from '$features/navigation/navbar'

  navbarController.title('Prison Books Collective')
  navbarController.subtitle('Recipient Lookup')
</script>

<svelte:head>
  <title>BellBooks - Recipient Lookup</title>
</svelte:head>

<main data-layout="page">
  <h1>SvelteKit App</h1>
</main>

<style lang="scss">
  [data-layout='page'] {
    width: 100vw;
    padding: 1rem;
    overflow-x: hidden;
  }
</style>
