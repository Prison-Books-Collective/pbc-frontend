<script lang="ts">
  import { fade } from 'svelte/transition'
  import { loadingController } from './loading'
  import loadingImage from '$assets/loading.svg'

  export let text = 'Loading'
</script>

{#if $loadingController}
  <aside data-layout="fullscreen" data-role="overlay" transition:fade>
    <h2>{text}</h2>
    <img
      src={loadingImage}
      data-role="loading-image"
      alt="content loading, netwwork request in progress"
    />

    {#each Object.keys($$slots) as _}
      <slot />
    {/each}
  </aside>
{/if}

<style>
  [data-layout='fullscreen'] {
    position: fixed;
    inset: 0px;

    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }

  [data-role='overlay'] {
    z-index: 1000;

    background-color: rgba(0, 0, 0, 0.3);
    color: #eaeaea;
  }

  [data-role='loading-image'] {
    max-height: 2rem;
    display: inline;
  }
</style>
