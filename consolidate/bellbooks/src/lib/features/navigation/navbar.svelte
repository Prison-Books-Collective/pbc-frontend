<script lang="ts">
  // import { navbarController } from './navbar'
  import NavigationDrawer from './navigation-drawer.svelte'

  import menuIcon from '$assets/icons/menu.svg'
  // import bellIcon from '$assets/icons/bell.svg'

  let drawer: NavigationDrawer
</script>

<NavigationDrawer bind:this={drawer} />

<button on:click={() => drawer.open()} on:keypress={() => drawer.open()}>
  <img class="icon" src={menuIcon} alt="menu icon, click to expand navigation options" />
</button>

<!-- <header>

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

  <img class="icon" src={bellIcon} alt="notifications icon, click to expand details" />
</header> -->

<style lang="scss">
  .icon {
    position: absolute;
    top: 1rem;
    right: 1rem;

    max-height: 1.75rem;
    max-width: 2.5rem;

    opacity: 0.5;
    cursor: pointer;
    transition-duration: 0.3s;

    &:hover {
      opacity: 1;
    }
  }

  // header {
  //   position: sticky;
  //   top: 0;
  //   display: grid;
  //   grid-template-columns: 2rem 1fr 2rem;
  //   place-items: center;
  //   gap: 1rem;

  //   height: 5rem;
  //   max-height: 5rem;

  //   // background: var(--brand-color-secondary-cream);
  //   padding: 1rem;
  //   // box-shadow: 0px 2px 10px rgb(0 0 0 / 0.3);
  //   overflow-y: hidden;
  // }

  // nav {
  //   text-align: center;

  //   .title,
  //   .subtitle {
  //     --size: min(1rem, 5vw);
  //     font-size: min(var(--size));
  //     color: var(--color-text);
  //     line-height: 0px;
  //     text-align: center;
  //   }

  //   .title {
  //     --size: min(1.5rem, 7vw);
  //     text-transform: capitalize;
  //     font-weight: 600;
  //     opacity: 1;
  //     font-family: 'Zilla Slab';
  //   }

  //   .subtitle {
  //     font-weight: 500;
  //     text-align: center;
  //     opacity: 0.7;
  //     font-family: 'Zilla Slab';
  //   }
  // }
</style>
