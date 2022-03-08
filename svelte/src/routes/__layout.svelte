<script>
  import logo from '$lib/assets/pbc-logo-small.png'
  import logoText from '$lib/assets/pbc-text.svg'
  import search from '$lib/assets/icons/search.png'
  import settings from '$lib/assets/icons/gear.png'
</script>

<nav>
  <div id="navigation-buttons">
    <a href="/">
      <img src={search} alt="Magnifying Glass Search Icon" class="icon"/>
    </a>
    <a href="/admin">
      <img src={settings} alt="Gear Settings Icon" class="icon"/>
    </a>
  </div>

  {#if false}
  <div id="inmate-name">
    <h1 id="" aria-label="Inmate's first and last name, and inmate ID if available">
      Samah Majadla&ensp;
      <span>ID#123</span>
    </h1>
  </div>
  {/if}

  <img id="logo-text" src={logoText} alt="Logo text for Prison Books Collective"/>
	<img id="logo" src={logo} alt="Logo for Prison Books Collective"/>
</nav>

<slot></slot>

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

  #inmate-name {
    display: flex;
    flex-flow: row wrap;

    justify-content: space-between;
    align-items: center;

    h1 {
      font-size: 1.5rem;
    }

    span {
      color: darkslategray;
      font-weight: 700;
      font-size: 1.25rem;
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
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    
    height: 3rem;

    padding: 1rem;

    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);

    img {
      max-height: 3rem;
    }
  }

  .icon {
    max-height: 1.5rem;

    opacity: 0.5;
    transition-duration: 0.3s;

    &:hover {
      opacity: 1;
    }
  }
</style>