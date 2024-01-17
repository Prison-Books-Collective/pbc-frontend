<script lang="ts">
  import '$lib/assets/styles/styles.scss'

  import logo from '$assets/pbc-logo-small.png'
  import logoText from '$assets/pbc-text.svg'
  import home from '$assets/icons/home.png'
  import settings from '$assets/icons/gear.png'

  import { loading } from '$stores/loading'

  import Loading from '$components/loading.svelte'
  import Drawer from '$components/drawer.svelte'
  import AdminControls from './admin/+page.svelte'

  let admin: Drawer
</script>

{#if $loading}
  <Loading />
{/if}

<nav data-layout="navigation">
  <section class="fixed">
    <a href="/" class="home">
      <img src={home} alt="Navigation button for home page" class="icon" />
    </a>

    <img
      src={settings}
      alt="Navigation button for admin page"
      class="icon"
      on:click={() => admin.toggle()}
    />

    <img
      src={logoText}
      alt="Text-only logo for Prison Books Collective"
      class="focus-on-hover hide-click"
    />

    <span>
      <!-- Nothing here, this element placed to center the logoText image -->
    </span>

    <img src={logo} alt="Logo for Prison Books Collective" class="focus-on-hover" />
  </section>

  <section class="spacer" />
</nav>

<Drawer bind:this={admin}>
  <AdminControls />
</Drawer>

<div class="page-container">
  <slot />
</div>

<style lang="scss">
  .page-container {
    position: fixed;
    inset: 0;
    top: 5rem;
    max-height: 100dvh;
    overflow: scroll;
    max-width: 100vw;
  }

  [data-layout='navigation'] {
    .fixed {
      position: fixed;
      top: 0;
      width: 100vw;
      padding: 1rem;

      display: grid;
      justify-items: center;
      align-items: center;
      gap: 0.25em;
      grid-template-areas: 'home-icon admin-icon text-logo . image-logo';
      grid-template-columns: auto auto 1fr auto auto;

      background-color: var(--color-bg);
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);

      z-index: 101;

      & > img:not(.icon) {
        max-height: 3rem;
      }
    }

    .spacer {
      height: 5rem;
    }
  }

  .home {
    scale: 1.4;
    transform: translateY(2px);
    margin-right: 0.2rem;
  }

  .hide-click {
    z-index: -1;
  }
</style>
