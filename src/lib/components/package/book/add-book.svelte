<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'
  import { focusedBook } from '$stores/book'
  import type { Book } from '$models/pbc/shipment'
  import { BookService } from '$services/pbc/book.service'
  import { createShipment } from '$lib/data/shipment.data'
  import { loading } from '$stores/loading'

  enum DISPLAY_FORM {
    WITH_ISBN,
    WITHOUT_ISBN,
  }

  const dispatch = createEventDispatcher()

  export let display: DISPLAY_FORM = DISPLAY_FORM.WITH_ISBN

  let inputAuthor: string
  let creatorType = null

  let noISBNSearchResults: Book[] | null = null

  let prefix = null
  let firstName = null
  let middleName = null
  let lastName = null
  let suffix = null
  let groupName = null
  let scanInput
  let inputISBN
  let inputTitle: string

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
  $: saveNoISBNBook = async (book: Book) => {
    console.log({ book })
    const createdBook = await BookService.createBook(book)
    createShipment.addContent('book', createdBook)
    dispatch('update', book)
  }

  $: searchNoISBNBook = async () => {
    loading.start()
    noISBNSearchResults = await BookService.searchBookByTitleAndAuthor(inputTitle, inputAuthor)
    loading.end()
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
  <form on:submit|preventDefault={searchNoISBNBook}>
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

    {#if noISBNSearchResults === null}
      <div class="form-options space">
        <button class="success" disabled={shouldDisableSearchNoISBN()}>Search for Book </button>
        <button type="button" class="danger" on:click={isbnClicked}>Search by ISBN?</button>
        <button type="button" on:click={cancelClicked}>Cancel</button>
      </div>
    {:else if noISBNSearchResults.length === 0}{:else}
      <div class="form-options space">
        <button class="success" disabled={shouldDisableSearchNoISBN()}>New Search for Book </button>
        <button type="button" class="danger" on:click={isbnClicked}>Search by ISBN?</button>
        <button type="button" on:click={cancelClicked}>Cancel</button>
      </div>

      <ul>
        {#each noISBNSearchResults as book}
          <li class="search-result" on:click={() => saveNoISBNBook(book)}>
            <strong>{book.title}</strong>
            <span>{book.authors}</span>
            <div>
              <strong>ISBN10: </strong>
              {book.isbn10}
            </div>
            <div>
              <strong>ISBN13: </strong>
              {book.isbn13}
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </form>
{/if}

<style lang="scss">
  button {
    flex-grow: 1;
  }

  ul:has(.search-result) {
    list-style-type: none;

    display: flex;
    flex-flow: row wrap;

    align-items: center;
    justify-content: flex-start;

    margin-top: 1rem;
    gap: 1rem;
  }

  .search-result {
    display: flex;
    flex-flow: column nowrap;

    flex: 200px;

    padding: 1rem;
    cursor: pointer;

    box-shadow: 0px 0px 10px rgba(0 0 0 / 0.3);
    transition-duration: 0.3s;

    * {
      margin-bottom: 0.25rem;
    }
  }

  .search-result:hover {
    background-color: rgba(61 130 61 / 1);
    color: white;
  }
</style>
