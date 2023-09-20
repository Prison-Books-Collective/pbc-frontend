<script lang="ts">
  import { page } from '$app/stores'
  import logo from '$assets/pbc-logo.svg'
  import logoText from '$assets/pbc-text.svg'
  import Drawer from '$features/drawer/drawer.svelte'

  const currentPage = new URL($page?.url)?.pathname
  let drawer: Drawer

  export function open() {
    drawer.open()
  }
</script>

<Drawer bind:this={drawer}>
  <header>
    <img src={logo} alt="Logo for Prison Books Collective" />
    <img src={logoText} alt="Prison Books Collective (display text)" />
  </header>

  <nav>
    <ul>
      <li>
        <a href="/" class:active={currentPage === '/'}>Recipient Lookup</a>
      </li>

      <li>
        <a href="/admin/zines" class:active={currentPage === '/admin/zines'}>Manage Zines</a>
      </li>

      <li>
        <a href="/admin/facilities" class:active={currentPage === '/admin/facilities'}>
          Manage Facilities
        </a>
      </li>

      <li>
        <a href="/admin/requests" class:active={currentPage === '/admin/requests'}>
          Special Requests
        </a>
      </li>

      <li>
        <a href="/#">Sign Out</a>
      </li>
    </ul>
  </nav>
</Drawer>

<style lang="scss">
  header {
    height: 5rem;
    max-height: 5rem;
    padding: 1rem;
    box-shadow: 0px 2px 10px rgb(0 0 0 / 0.3);

    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    img {
      max-height: 2.5rem;
    }
  }

  nav {
    height: min(500px, calc(100% - 5rem));
    padding: 1rem;

    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-items: center;
    gap: 2rem;

    ul {
      display: contents;
      list-style: none;

      font-family: 'Zilla Slab';
    }

    a {
      position: relative;
      color: inherit;
      font-weight: 500;
      text-decoration: none;
      opacity: 0.5;
      transition-duration: 0.3s;

      &.active {
        font-weight: 600;
        opacity: 1;
        cursor: default;

        &::before {
          opacity: 1;
          transform: scale(1);
        }
      }

      &::before {
        content: '';
        position: absolute;
        width: 2px;
        height: 1.5rem;
        background: black;
        left: -10px;
        transition-duration: 0.3s;
        opacity: 0;
        transform: scale(0);
        transform-origin: center;
      }

      &:hover {
        opacity: 1;

        &::before {
          opacity: 1;
          transform: scale(1);
        }
      }
    }
  }
</style>
