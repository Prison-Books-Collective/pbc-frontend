<script lang="ts">
  import { navbarController } from './navbar'

  import Drawer from '$features/drawer/drawer.svelte'
  import logo from '$assets/pbc-logo-small.png'
  import menuIcon from '$assets/icons/menu.svg'
  import bellIcon from '$assets/icons/bell.svg'

  let drawer: Drawer
</script>

<Drawer bind:this={drawer}>
  <nav class="admin">
    <ul>
      <li>Content 1</li>
      <li>Content 2</li>
    </ul>
  </nav>
</Drawer>

<header>
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <img
    class="icon menu"
    src={menuIcon}
    alt=""
    on:click={() => drawer.open()}
    on:keypress={() => drawer.open()}
  />
  <!-- <a href="/" style="display: contents;">
    <img class="logo" src={logo} alt="" />
  </a> -->
  <nav>
    {#if $navbarController?.title}
      <span class="title">{$navbarController.title}</span>
    {/if}
    {#if $navbarController?.title && $navbarController?.subtitle}
      <br />
    {/if}
    {#if $navbarController?.subtitle}
      <span class="subtitle">{$navbarController?.subtitle}</span>
    {/if}
  </nav>
  <img class="icon notifications" src={bellIcon} alt="" />
</header>

<style lang="scss">
  header {
    padding: 1rem;
    box-shadow: 0px 2px 10px rgb(0 0 0 / 0.3);

    img {
      max-height: 2.5rem;
      max-width: 2.5rem;
    }

    :is(.menu, .notifications) {
      max-height: 1.75rem;
    }

    display: grid;
    grid-template-columns: 2rem 1fr 2rem;
    place-items: center;
    gap: 1rem;

    .icon {
      opacity: 0.5;
      cursor: pointer;
      transition-duration: 0.3s;
    }

    .icon:hover {
      opacity: 1;
    }
  }

  nav {
    text-align: center;
    .title,
    .subtitle {
      --size: 1rem;
      font-size: var(--size);
      line-height: calc(var(--size) / 1.5);
      text-align: center;
    }

    .title {
      --size: 1.5rem;
      text-transform: capitalize;
      font-weight: 600;
      font-family: 'Zilla Slab';
    }

    .subtitle {
      font-weight: 500;
      text-align: center;
      opacity: 0.7;
      font-family: 'Zilla Slab';
    }
  }

  @media only screen and (max-width: 600px) {
    header {
      grid-template-columns: 2rem 1fr 2rem;
    }
    .logo {
      display: none;
    }
  }

  /* 
  header nav {
    padding: 1rem;
    display: grid;

    max-width: 100vw;
    overflow: scroll;

    grid-template-columns: 2rem 1fr 2rem;
    gap: 1rem;
    grid-template-areas: 'logo title notifications';
  }

  @media only screen and (max-width: 600px) {
    header nav {
      grid-template-columns: 2rem 2rem 1fr 2rem;
      grid-template-areas: 'hamburger logo . notifications';
    }

    header nav .hamburger {
      display: block !important;
    }
    header nav .title {
      display: none !important;
    }
  }

  header nav .hamburger {
    display: none;
  }

  header nav .title {
    display: block;
  }

  .header-item img {
    max-width: 2rem;
    max-height: 2rem;
  }

  header nav .hamburger {
    grid-area: hamburger;
  }

  header nav .logo {
    grid-area: logo;
  }

  header nav .logo img {
    max-height: 2.5rem;
    max-width: 2.5rem;
  }

  header nav .title {
    grid-area: title;
    text-align: center;
  }

  header nav .title img {
    max-height: 2.5rem;
  }

  header nav .notifications {
    grid-area: notifications;
  }

  header nav .notifications img {
    max-height: 1.5rem;
  } */

  .admin {
    width: 100%;
    height: 100%;
    background: green;
    margin: 0px;
    padding: 2rem;
  }
</style>
