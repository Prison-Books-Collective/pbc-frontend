<script lang="ts">
  import { fly } from 'svelte/transition'
  import { page } from '$app/stores'
  import { flip } from 'svelte/animate'
</script>

<main data-layout="page">
  {#each Object.keys($$slots) as _ ($page.url)}
    <div
      animate:flip={{ duration: 300 }}
      in:fly={{ x: 300, duration: 300, delay: 300 }}
      out:fly={{ x: -300, duration: 300 }}
    >
      <slot />
    </div>
  {/each}
</main>

<style lang="scss">
  [data-layout='page'] {
    position: fixed;
    inset: 0;
    top: 5rem;
    overflow: scroll;

    display: grid;
  }
</style>
