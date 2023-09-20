<script lang="ts">
  import { navbarController } from '$features/navigation/navbar'

  navbarController.title('Prison Books Collective')
  navbarController.subtitle('Recipient Lookup')
</script>

<svelte:head>
  <title>BellBooks - Recipient Lookup</title>
</svelte:head>

<main data-layout="page">
  <form>
    <!-- svelte-ignore a11y-autofocus -->
    <input
      name="search"
      type="text"
      placeholder="Recipient Name or ID"
      required
      minlength="3"
      autofocus
    />

    <button> Search </button>
  </form>
</main>

<style lang="scss">
  [data-layout='page'] {
    width: 100vw;
    padding: 1rem;
    overflow-x: hidden;
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
    background: lavender;
    border-radius: 5px;
  }

  button {
    width: 100%;
    padding: 1rem;
    background: none;
    border: none;
    font-size: 1.2rem;

    background-color: lavender;
    border-radius: 5px;

    cursor: pointer;
  }
</style>
