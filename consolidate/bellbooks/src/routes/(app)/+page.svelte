<script lang="ts">
  import { navbarController } from '$features/navigation/navbar'
  import SearchIcon from '$assets/icons/search.svg'
  import { fade } from 'svelte/transition'
  import { url, GET } from '$util/www'
  import type { Recipient } from '$db/types'
  import { LoadingController } from '$lib/features/loading/loading'
  import LoadSpinner from '$features/loading/load-spinner.svelte'
  import Popover from '$features/popover/popover.svelte'

  // import type { PageData } from './$types'
  // export let data: PageData

  let searchQuery: string
  let stopTypingTimeout: number
  let searchResults: Recipient[]
  let errorMessage: string
  let loadingController = new LoadingController()
  let searchResultsAnchor: HTMLElement

  async function search(query: string) {
    console.log('oi')
    resetTimer()

    searchResults = await loadingController.displayWhile(async () => {
      errorMessage = undefined
      if (query.trim() === '') return undefined
      const response = await fetch(url('recipient/search', { q: query }), { ...GET })
      const result = await response.json()

      // await new Promise(resolve => setTimeout(() => resolve(null), 2000))
      if ('message' in result) {
        errorMessage = result.message as string
        console.error(errorMessage)
        return []
      }

      return result as Recipient[]
    })
  }

  navbarController.title('Prison Books Collective')
  // navbarController.subtitle('')

  function handleStopTyping(seconds: number): (e: KeyboardEvent) => void {
    return (e: KeyboardEvent) => {
      if (stopTypingTimeout) resetTimer()
      if (e.key === 'Enter') return
      stopTypingTimeout = setTimeout(async () => {
        await search(searchQuery)
      }, seconds * 1000) as any as number
    }
  }

  function resetTimer() {
    if (stopTypingTimeout) {
      clearTimeout(stopTypingTimeout)
      stopTypingTimeout = undefined
    }
  }
</script>

<svelte:head>
  <title>BellBooks - Recipient Lookup</title>
</svelte:head>

{#if searchResults && searchResults.length > 0}
  <Popover anchor={searchResultsAnchor} anchorPoint="bottom" anchorOffset={{ y: 16, x: 0 }}>
    <section transition:fade={{ duration: 300 }} data-role="search-results" class="card">
      <ul>
        {#each searchResults as r}
          <a href={r.assignedId ? `/recipient/assigned/${r.assignedId}` : `/recipient/${r.id}`}>
            <li class="info">
              <span class="header">
                {r.firstName}{r.middleName ? ' ' + r.middleName + ' ' : ' '}{r.lastName}
              </span>
              <span class="subheader">{r.assignedId ? `ID #${r.assignedId}` : ''}</span>
            </li>
          </a>
        {/each}
        <li>
          <span class="header">Add New Recipient</span>
        </li>
      </ul>
    </section>
  </Popover>
{/if}

{#if errorMessage}
  <Popover anchor={searchResultsAnchor} anchorPoint="bottom" anchorOffset={{ y: 16, x: 0 }}>
    <section transition:fade={{ duration: 300 }} data-role="error" class="card">
      <p>{errorMessage}</p>
    </section>
  </Popover>
{/if}

<main data-layout="page">
  <section data-role="search" bind:this={searchResultsAnchor}>
    <form on:submit|preventDefault={() => search(searchQuery)}>
      <input
        type="text"
        placeholder="search for recipient by name or ID"
        bind:value={searchQuery}
        on:keyup={handleStopTyping(1)}
      />
    </form>
    {#if $loadingController}
      <div class="img" transition:fade={{ duration: 300 }}>
        <LoadSpinner color="black" controller={loadingController} />
      </div>
    {:else}
      <img
        transition:fade={{ duration: 300 }}
        src={SearchIcon}
        alt="magnifying glass: indicator icon for search bar"
      />
    {/if}
  </section>

  <button class="create-package"> Create Package </button>
</main>

<style lang="scss">
  form {
    display: contents;
  }

  .card {
    background: var(--color-bg);
    border-radius: 5px;
    box-shadow: 2px 2px 10px rgb(0 0 0 / 0.3);

    ul {
      list-style: none;
      line-height: 3rem;
      padding: 0px;
      margin: 0px;
    }

    max-height: min(400px, 50vh);
    overflow-y: scroll;
    scroll-behavior: smooth;
    scrollbar-gutter: stable;

    li {
      padding: 1rem;
      padding-inline: 2rem;
      display: grid;
      border-bottom: solid 1px rgb(0 0 0 / 0.3);
      .header {
        text-transform: capitalize;
        font-weight: 500;
        font-size: 1.2rem;
        line-height: 2rem;
      }
      .subheader {
        font-size: 1rem;
        line-height: 1rem;
      }
    }

    a {
      // display: contents;
      color: currentColor;
      text-decoration: none;
    }
  }

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
    margin: 1rem;
    img,
    .img {
      position: absolute;
      max-width: 1.2rem;
      max-height: 1.2rem;

      top: calc(50% - 0.6rem);
      left: 1rem;

      opacity: 0.3;
      transition-duration: 0.3s;
    }

    .img {
      opacity: 0.3;
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
