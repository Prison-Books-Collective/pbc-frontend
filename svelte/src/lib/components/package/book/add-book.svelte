<script lang="ts" context="module">
  enum DISPLAY_FORM {
    WITH_ISBN,
    WITHOUT_ISBN
  }
</script>

<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'
  import { focusedBook } from '$stores/book'
  import { focusedPackage} from '$stores/package'
    import type { Author } from '$models/pbc/shipment'

  const dispatch = createEventDispatcher()

  export let display: DISPLAY_FORM = DISPLAY_FORM.WITH_ISBN

  let scanInput
  let inputISBN
  let inputTitle
  let inputAuthor

  onMount(() => {
    scanInput.focus()
  })

  const cancelClicked = () => dispatch('cancel')
  const isbnClicked = () => {
    display = DISPLAY_FORM.WITH_ISBN
    dispatch('isbn')
  }
  const noISBNClicked = () => {
    display = DISPLAY_FORM.WITHOUT_ISBN
    dispatch('no-isbn')
  }

  $: shouldDisableSearch = () => {
    return !inputISBN || (inputISBN.length !== 10 && inputISBN.length !== 13)
  }
  $: shouldDisableSearchNoISBN = () => {
    return !inputTitle || inputTitle.trim().length === 0
  }
  $: loadISBN = async () => {
    if (shouldDisableSearch()) return
    focusedBook.fetchBookByISBN(inputISBN) // TODO need to separate the search book functionality from
    dispatch('search', inputISBN)
  }
  $: saveNoISBNBook = async () => {
    focusedBook.set({
      id: null,
      type: 'book',
      title: inputTitle,
      creators: [{
        type: "author",
        firstName: inputAuthor.split(' ')[0],
        lastName: inputAuthor.split(' ')[1] 
      } as Author] 
    })
    await focusedBook.sync()
    focusedPackage.addBook($focusedBook)
    dispatch('update', $focusedBook)
  }
</script>

{#if display === DISPLAY_FORM.WITH_ISBN}
  <form on:submit|preventDefault={loadISBN}>
    <label for="isbn-input">
      Scan book ISBN
      <input
        type="text"
        name="isbn-input"
        id="isbn-input"
        placeholder="Click here, then scan"
        bind:value={inputISBN}
        bind:this={scanInput}
      />
    </label>

    <div class="form-options">
      <button class="success" disabled={shouldDisableSearch()} type="submit">
        Search for Book
      </button>
      <button type="button" class="danger" on:click={noISBNClicked}>No ISBN?</button>
      <button type="button" on:click={cancelClicked}>Cancel</button>
    </div>
  </form>
{/if}

{#if display === DISPLAY_FORM.WITHOUT_ISBN}
  <form on:submit|preventDefault={saveNoISBNBook}>
    <p>Fill out the information below and save book (or resource)</p>

    <label for="book-title">
      Title
      <input
        type="text"
        name="book-title"
        id="book-title"
        placeholder="Title of Book"
        bind:value={inputTitle}
      />
    </label>

    <label for="book-author">
      Author
      <input
        type="text"
        name="book-author"
        id="book-author"
        placeholder="Author of Book"
        bind:value={inputAuthor}
      />
    </label>

    <div class="form-options space">
      <button class="success" disabled={shouldDisableSearchNoISBN()}>
        Save Book and Add to Package
      </button>
      <button type="button" class="danger" on:click={isbnClicked}>Search by ISBN?</button>
      <button type="button" on:click={cancelClicked}>Cancel</button>
    </div>
  </form>
{/if}

<style>
  button {
    flex-grow: 1;
  }
</style>
