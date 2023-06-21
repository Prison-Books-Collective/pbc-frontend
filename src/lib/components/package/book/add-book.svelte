<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'
  import type { Book } from '$models/pbc/shipment'
  import { createShipment } from '$lib/data/shipment.data'
  import { books, createBook } from '$lib/data/book.data'

  enum DISPLAY_FORM {
    WITH_ISBN,
    WITHOUT_ISBN,
    WITHOUT_ISBN_SEARCH_RESULTS,
    WITHOUT_ISBN_MANUAL_ENTRY,
  }

  const dispatch = createEventDispatcher()

  export let display: DISPLAY_FORM = DISPLAY_FORM.WITH_ISBN

  let inputAuthor: string
  let creatorType = null

  let noISBNSearchResults: Book[] | null = null
  let shouldDisplayManualInput = false

  let inputTitle: string

  let isbnInput: string
  let isbnInputElement: HTMLInputElement

  books.reset()
  createBook.reset()

  onMount(() => {
    isbnInputElement.focus()
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
    return !isbnInput || (isbnInput.length !== 10 && isbnInput.length !== 13)
  }
  $: shouldDisableSearchNoISBN = () => {
    return !$createBook.title || $createBook.title.trim().length === 0
  }
  $: loadISBN = async () => {
    if (shouldDisableSearch()) return
    createBook.fetch({ isbn: isbnInput })
    dispatch('search', isbnInput)
  }
  $: saveNoISBNBook = async (book?: Book) => {
    if (!!book) createBook.load(book)
    const createdBook = await createBook.sync()
    createShipment.addContent('book', createdBook)
    dispatch('update', createdBook)
  }

  $: searchNoISBNBook = async () => {
    const { title, authors: author } = $createBook
    await books.fetch({ title, author })
    display =
      $books.length === 0
        ? DISPLAY_FORM.WITHOUT_ISBN_MANUAL_ENTRY
        : DISPLAY_FORM.WITHOUT_ISBN_SEARCH_RESULTS
  }

  const presentManualEntry = () => {
    books.reset()
    display = DISPLAY_FORM.WITHOUT_ISBN_MANUAL_ENTRY
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
        bind:value={isbnInput}
        bind:this={isbnInputElement}
      />
    </label>

    <div class="form-options">
      <button type="button" on:click={cancelClicked}>Cancel</button>
      <button type="button" class="danger" on:click={noISBNClicked}>No ISBN?</button>
      <button class="success" disabled={shouldDisableSearch()} type="submit">
        Search for Book
      </button>
    </div>
  </form>
{/if}

{#if display === DISPLAY_FORM.WITHOUT_ISBN || (display === DISPLAY_FORM.WITHOUT_ISBN_SEARCH_RESULTS && $books.length > 0)}
  <form on:submit|preventDefault={searchNoISBNBook}>
    <h1>Search</h1>
    <p>Fill out the information below to search for the book or resource</p>

    <label for="book-title">
      Title
      <input
        type="text"
        name="book-title"
        id="book-title"
        placeholder="Title of Book"
        bind:value={$createBook.title}
      />
    </label>

    <label for="book-author">
      Author
      <input
        type="text"
        name="book-author"
        id="book-author"
        placeholder="Author of Book"
        bind:value={$createBook.authors}
      />
    </label>

    <div class="form-options space">
      <button type="button" on:click={cancelClicked}>Cancel</button>
      <button type="button" class="danger" on:click={isbnClicked}>Search by ISBN?</button>
      <button class="success" disabled={shouldDisableSearchNoISBN()}>
        {$books.length > 0 ? 'New ' : ''}
        Search for Book
      </button>
    </div>

    {#if display === DISPLAY_FORM.WITHOUT_ISBN_SEARCH_RESULTS && $books.length > 0}
      <ul>
        {#each $books as book}
          <li
            class="search-result"
            class:green-border={book.id}
            on:click={() => saveNoISBNBook(book)}
          >
            <span>
              <strong>{book.title}</strong>
              {#if book.authors}
                by <span>{book.authors}</span>
              {/if}
            </span>
            {#if book.isbn10 || book.isbn13}
              <span class="small-text">
                {#if book.isbn10}
                  <strong>ISBN10-</strong>{book.isbn10}
                {/if}
                {#if book.isbn10 && book.isbn13}
                  &nbsp;&nbsp;
                {/if}
                {#if book.isbn13}
                  <strong>ISBN13-</strong>{book.isbn13}
                {/if}
              </span>
            {/if}
            <!-- <div>
              <strong>ISBN10: </strong>
              {book.isbn10}
            </div>
            <div>
              <strong>ISBN13: </strong>
              {book.isbn13}
            </div> -->
          </li>
        {/each}
      </ul>

      <div class="form-options space" on:click={() => presentManualEntry()}>
        <button> I don't see what I'm looking for</button>
      </div>
    {/if}
  </form>
{/if}

{#if display === DISPLAY_FORM.WITHOUT_ISBN_MANUAL_ENTRY || (display === DISPLAY_FORM.WITHOUT_ISBN_SEARCH_RESULTS && $books.length === 0)}
  <form on:submit|preventDefault={() => saveNoISBNBook()}>
    <h1>Save & Add to Package</h1>

    <label for="book-title">
      Title
      <input
        type="text"
        name="book-title"
        id="book-title"
        placeholder="Title of Book"
        bind:value={$createBook.title}
      />
    </label>

    <label for="book-author">
      Author
      <input
        type="text"
        name="book-author"
        id="book-author"
        placeholder="Author of Book"
        bind:value={$createBook.authors}
      />
    </label>

    <div class="form-options space">
      <button class="success" disabled={shouldDisableSearchNoISBN()}>
        Save and Add to Package
      </button>
      <button type="button" on:click={cancelClicked}>Cancel</button>
    </div>
  </form>
{/if}

<style lang="scss">
  button {
    flex-grow: 1;
  }

  ul:has(.search-result) {
    list-style-type: none;

    display: flex;
    flex-flow: column nowrap;

    align-items: stretch;
    justify-content: flex-start;
    text-align: left;

    padding: 0;
    margin-top: 1rem;
    gap: 1rem;
  }

  .search-result {
    display: flex;
    flex-flow: column nowrap;

    padding: 1rem;
    cursor: pointer;

    box-shadow: 0px 0px 10px rgba(0 0 0 / 0.3);
    transition: background-color 0.3s, color 0.3s;
  }

  .search-result:hover {
    background-color: rgba(61 130 61 / 1);
    color: white;
  }

  .small-text {
    font-size: 0.85rem;
    opacity: 0.6;
  }

  .green-border {
    border: 3px solid rgba(61 130 61 / 1);
  }
</style>
