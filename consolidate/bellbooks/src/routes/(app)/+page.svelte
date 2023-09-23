<script lang="ts">
  import { navbarController } from '$features/navigation/navbar'
  import SearchIcon from '$assets/icons/search.svg'
  import Noise from '$assets/noise.png'

  navbarController.title('Prison Books Collective')
  // navbarController.subtitle('')
</script>

<svelte:head>
  <title>BellBooks - Recipient Lookup</title>
</svelte:head>

<main data-layout="page">
  <section data-role="search">
    <input type="text" placeholder="search for recipient by name or ID" />
    <img src={SearchIcon} alt="magnifying glass: indicator icon for search bar" />
  </section>

  <button class="create-package"> Create Package </button>
</main>

<style lang="scss">
  [data-layout='page'] {
    width: 100vw;
    // padding: 1rem;
    overflow-x: hidden;

    height: calc(100svh - 5rem);

    display: grid;
    grid-template-areas:
      'top'
      'center'
      'bottom';
    grid-template-rows: 5rem 1fr 5rem;
  }

  [data-role='search'] {
    position: relative;
    height: fit-content;
    margin-inline: 1rem;
    img {
      position: absolute;
      max-width: 1.2rem;
      max-height: 1.2rem;

      top: calc(50% - 0.6rem);
      left: 1rem;

      opacity: 0.3;
      transition-duration: 0.3s;
    }

    input {
      width: 100%;
      background: white;
      border: solid 2px rgb(0 0 0 / 0.3);
      border-radius: 30px;
      padding: 0.5rem;
      text-align: left;
      padding-left: 3rem;

      transition-duration: 0.3s;
    }

    input::placeholder {
      color: rgb(0 0 0 / 0.3);
    }

    input:focus {
      & ~ img {
        opacity: 0.7;
      }
      outline: none;
      border: solid 2px rgb(0 0 0 / 0.7);
    }
  }

  form {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  label {
    font-family: 'Roboto';
    padding: 1rem;
    display: contents;
  }

  input {
    font-family: 'Roboto';
    width: 100%;
    padding: 1rem;
    font-size: 1.2rem;
    border: none;
    text-align: center;
    background: var(--brand-color-primary-white);
    color: var(--color-bg-contrast);
    border-radius: 5px;
  }

  button {
    width: 100%;
    padding: 1rem;
    background: none;
    border: none;
    font-size: 1.2rem;
    font-family: 'Zilla Slab';
    font-weight: 500;

    cursor: pointer;
  }

  .create-package {
    background-color: var(--brand-color-accent-yellow);
    background-image: url('../../lib/assets/noise.png');
    background-blend-mode: multiply;
    background-repeat: repeat;
    background-size: 25%;
    background-position-y: 0px;

    color: rgb(0 0 0 / 0.6);

    box-shadow: 2px 2px 5px rgb(0 0 0 / 0.3);

    transition-duration: 0.3s;

    grid-area: bottom;
  }

  .create-package:hover {
    transform-origin: bottom;
    // transform: scaleY(1.2);
    // box-shadow: 0px 0px 15px var(--brand-color-accent-yellow);
    background-position-y: -25px;
    transition-timing-function: ease-out;
  }
</style>
