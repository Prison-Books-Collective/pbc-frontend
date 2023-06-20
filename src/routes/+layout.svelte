<script>
  import logo from '$assets/pbc-logo-small.png'
  import logoText from '$assets/pbc-text.svg'
  import home from '$assets/icons/home.png'
  import settings from '$assets/icons/gear.png'
  import Loading from '$components/loading.svelte'
  import { loading } from '$stores/loading'
</script>

{#if $loading}
  <Loading />
{/if}

<nav data-layout="navigation">
  <section class="fixed">
    <a href="/">
      <img src={home} alt="Navigation button for home page" class="icon home" />
    </a>

    <a href="/admin">
      <img src={settings} alt="Navigation button for admin page" class="icon" />
    </a>

    <img src={logoText} alt="Text-only logo for Prison Books Collective" class="focus-on-hover" />

    <span>
      <!-- Nothing here, this element placed to center the logoText image -->
    </span>

    <img src={logo} alt="Logo for Prison Books Collective" class="focus-on-hover" />
  </section>

  <section class="spacer" />
</nav>

<slot />

<style lang="scss">
  [data-layout='navigation'] {
    .fixed {
      box-sizing: border-box; // todo: border-box setting should be a global reset

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

      & > img {
        max-height: 3rem;
      }
    }

    .spacer {
      height: 5rem;
    }
  }

  .home {
    max-height: 2.15rem;
  }
</style>
