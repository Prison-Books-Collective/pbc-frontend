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

<nav id="nav-primary">
  <div id="navigation-buttons">
    <a href="/">
      <img src={home} alt="Home Icon" class="icon home" />
    </a>
    <a href="/admin">
      <img src={settings} alt="Gear Settings Icon" class="icon" />
    </a>
  </div>

  <img id="logo-text" src={logoText} alt="Logo text for Prison Books Collective" />
  <img id="logo" src={logo} alt="Logo for Prison Books Collective" />
</nav>

<div id="nav-spacer" />

<slot />

<style lang="scss">
  * {
    --color-inactive: #eaeaea;
    --color-active: #333;
  }

  #logo {
    opacity: 0.5;
    transition-duration: 0.3s;

    &:hover {
      opacity: 1;
    }
  }

  #logo-text {
    opacity: 0.5;
    transition-duration: 0.3s;

    &:hover {
      opacity: 1;
    }
  }

  #navigation-buttons {
    width: 4rem;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
  }

  nav {
    position: fixed;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    background-color: #e8e7e2;
    z-index: 100;

    height: 3rem;
    width: calc(100vw - 2rem);

    padding: 1rem;

    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);

    img {
      max-height: 3rem;
    }
  }

  #nav-spacer {
    height: 3rem;
    padding: 1rem;
  }

  .icon {
    max-height: 1.5rem;
  }
  .home {
    max-height: 2.15rem;
  }
</style>
