<script lang="ts" context="module">
  enum VALID_MODE {
    DISPLAY = 'display-book',
    EDIT = 'edit-book',
    CREATE = 'create-book'
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { focusedBook } from '$stores/book'
  import { focusedPackage } from '$stores/package'
  import { bookHasISBN } from '$models/pbc/shipment'
  import { isEmpty } from '$util/strings'
    import Book from '$components/book.svelte'

  const dispatch = createEventDispatcher()

  export let mode = VALID_MODE.DISPLAY
  export let isbn = null

  let newTitle
  let newAuthor

  $: mode = $focusedBook.existsInDatabase ? VALID_MODE.DISPLAY : VALID_MODE.CREATE

  const addBookClicked = () => {
    focusedPackage.addBook($focusedBook)
    dispatch('add-book', $focusedBook)
  }

  const editBookClicked = () => {
    mode = VALID_MODE.EDIT
    isbn = $focusedBook.isbn10 || $focusedBook.isbn13 || null
    newTitle = $focusedBook.title
    newAuthor = $focusedBook.authors ? $focusedBook.authors.join(', ') : null
  }

  const cancelClicked = () => dispatch('cancel')
  const cancelEditClicked = () => {
    mode = VALID_MODE.DISPLAY
  }
  const searchClicked = () => dispatch('search')

  const shouldDisableEditAndAdd = (isbn, newAuthor, newTitle) =>
    isEmpty(isbn) ||
    (isbn.length !== 10 && isbn.length !== 13) ||
    isEmpty(newAuthor) ||
    isEmpty(newTitle)

  const editAndAdd = async (isbn, newAuthor, newTitle) => {
    $focusedBook.title = newTitle
    $focusedBook.authors = newAuthor.split(',').map((author) => author.trim())
    if (isbn.length === 10) {
      $focusedBook.isbn10 = isbn
    } else if (isbn.length === 13) {
      $focusedBook.isbn13 = isbn
    }
    await focusedBook.sync()
    focusedPackage.addBook($focusedBook)

    dispatch('add-book', $focusedBook)
  }
</script>

{#if mode === VALID_MODE.DISPLAY && $focusedBook.existsInDatabase}
  <section class="book-flow">
    <p>
      We found a book that matched
      {#if bookHasISBN($focusedBook).isbn10}
        ISBN10: <strong>{$focusedBook.isbn10}</strong>
      {/if}
      {#if bookHasISBN($focusedBook).isbn10 && bookHasISBN($focusedBook).isbn13}
        and
      {/if}
      {#if bookHasISBN($focusedBook).isbn13}
        ISBN13: <strong>{$focusedBook.isbn13}</strong>
      {/if}
    </p>
    <Book book={$focusedBook} />
    
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
  <form class="book-flow" on:submit|preventDefault={() => editAndAdd(isbn, newAuthor, newTitle)}>
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
      <button type="button" on:click={mode === VALID_MODE.EDIT ? cancelEditClicked : cancelClicked}
        >Cancel</button
      >
    </div>
  </form>
{/if}

{#if mode === VALID_MODE.CREATE && isbn}
  <form class="book-flow" on:submit|preventDefault={() => editAndAdd(isbn, newAuthor, newTitle)}>
    <p>
      We could not find the book with
      <strong>ISBN# {$focusedBook.isbn10 || $focusedBook.isbn13}</strong>
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

  .book-title {
    font-size: 2rem;
    margin-bottom: 0.25rem;
  }

  button {
    flex-grow: 1;
  }
</style>
