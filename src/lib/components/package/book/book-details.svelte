<script lang="ts">
  import { createBook } from '$lib/data/book.data'
  import { createShipment } from '$lib/data/shipment.data'
  import type { Book } from '$models/pbc/shipment'
  import { focusedBook } from '$stores/book'
  import { isDefined } from '$util/null'
  import { isEmpty } from '$util/strings'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  enum VALID_MODE {
    DISPLAY = 'display-book',
    EDIT = 'edit-book',
    CREATE = 'create-book',
  }

  export let mode = VALID_MODE.DISPLAY
  export let isbn: string = null

  let newTitle: string
  let newAuthor: string

  $: mode = VALID_MODE.DISPLAY
  $: isDisplayable = isDefined($createBook) && Object.keys($createBook).length > 0

  const addBookClicked = () => {
    createShipment.addContent('book', $createBook)
    dispatch('add-book', $createBook)
  }

  const editBookClicked = () => {
    mode = VALID_MODE.EDIT
    isbn = $createBook.isbn10 || $createBook.isbn13 || null
    newTitle = $createBook.title
    newAuthor = $createBook.authors
  }

  const searchClicked = () => dispatch('search')
  $: cancelClicked = () =>
    mode === VALID_MODE.EDIT ? (mode = VALID_MODE.DISPLAY) : dispatch('cancel')

  const shouldDisableEditAndAdd = (isbn: string, newAuthor: string, newTitle: string) =>
    isEmpty(isbn) ||
    (isbn.length !== 10 && isbn.length !== 13) ||
    isEmpty(newAuthor) ||
    isEmpty(newTitle)

  const editAndAdd = async (newAuthor: string, newTitle: string, isbn?: string) => {
    createBook.update((currentState) => ({ ...currentState, authors: newAuthor, title: newTitle }))
    if (!isEmpty(isbn)) {
      if (isbn!.length === 10)
        createBook.update((currentState) => ({ ...currentState, isbn10: isbn }))
      if (isbn!.length === 13)
        createBook.update((currentState) => ({ ...currentState, isbn13: isbn }))
    }
    await createBook.sync()
    createShipment.addContent('book', $createBook as Book)

    dispatch('add-book', $createBook)
  }
</script>

{#if mode === VALID_MODE.DISPLAY && isDisplayable}
  <section class="book-flow">
    <p>
      We found a book that matched
      {#if $createBook.isbn10}
        ISBN10: <strong>{$createBook.isbn10}</strong>
      {/if}
      {#if $createBook.isbn10 && $createBook.isbn13}
        and
      {/if}
      {#if $createBook.isbn13}
        ISBN13: <strong>{$createBook.isbn13}</strong>
      {/if}
    </p>
    <strong>{$createBook.title}</strong>
    {$createBook.authors}

    <p>Add it to the package by clicking the button below, or search for another book instead.</p>

    <div class="form-options">
      <button class="success" on:click={addBookClicked}>Add book to package</button>
      <button class="danger" on:click={editBookClicked}>Edit book info</button>
      <button on:click={searchClicked}>Nevermind, search for different book</button>
      <button on:click={cancelClicked}>Cancel</button>
    </div>
  </section>
{/if}

{#if mode === VALID_MODE.EDIT}
  <form class="book-flow" on:submit|preventDefault={() => editAndAdd(newAuthor, newTitle, isbn)}>
    <p>Edit the book information below, then save the book</p>

    <label for="new-isbn">
      ISBN10 or ISBN13
      <input type="text" name="new-isbn" id="new-isbn" placeholder="New ISBN" bind:value={isbn} />
    </label>

    <label for="new-title">
      Book Title
      <input
        type="text"
        name="new-title"
        id="new-title"
        placeholder="New Book Title"
        bind:value={newTitle}
      />
    </label>

    <label for="new-author">
      Book Author(s)
      <input
        type="text"
        name="new-author"
        id="new-author"
        placeholder="New Book Author(s)"
        bind:value={newAuthor}
      />
    </label>

    <div class="form-options">
      <button class="success" disabled={shouldDisableEditAndAdd(isbn, newAuthor, newTitle)}>
        Save book and add to package
      </button>
      <button on:click={cancelClicked}>Cancel</button>
    </div>
  </form>
{/if}

{#if mode === VALID_MODE.CREATE || !isDisplayable}
  <form class="book-flow" on:submit|preventDefault={() => editAndAdd(newAuthor, newTitle, isbn)}>
    <p>
      We could not find the book with
      <strong>ISBN# {$focusedBook.isbn10 ?? $focusedBook.isbn13 ?? isbn}</strong>
      in our database. Please add the title and author of the book and add it to the package.
    </p>

    <label for="new-isbn">
      ISBN10 or ISBN13
      <input type="text" name="new-isbn" id="new-isbn" placeholder="New ISBN" bind:value={isbn} />
    </label>

    <label for="new-title">
      Book Title
      <input
        type="text"
        name="new-title"
        id="new-title"
        placeholder="New Book Title"
        bind:value={newTitle}
      />
    </label>

    <label for="new-author">
      Book Author(s)
      <input
        type="text"
        name="new-author"
        id="new-author"
        placeholder="New Book Author(s)"
        bind:value={newAuthor}
      />
    </label>

    <div class="form-options">
      <button class="success" disabled={shouldDisableEditAndAdd(isbn, newAuthor, newTitle)}>
        Save book and add to package
      </button>
      <button type="button" on:click={cancelClicked}>Cancel</button>
    </div>
  </form>
{/if}

<style lang="scss">
  .book-flow {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
    text-align: center;
  }

  button {
    flex-grow: 1;
  }
</style>
