<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { focusedBook } from '$stores/book'
  import { bookHasISBN, type Author, type Book } from '$models/pbc/shipment'
  import { isEmpty } from '$util/strings'
  // import { Book } from '$components/book.svelte'
  import { BookService } from '$services/pbc/book.service'
  import { createShipment } from '$lib/data/shipment.data'

  const dispatch = createEventDispatcher()

  enum VALID_MODE {
    DISPLAY = 'display-book',
    EDIT = 'edit-book',
    CREATE = 'create-book',
  }

  export let mode = VALID_MODE.DISPLAY
  export let isbn: string | null = null
  let creatorType: 'author' | 'group' | null = null

  let prefix: string | null = null
  let firstName: string | null = null
  let middleName: string | null = null
  let lastName: string | null = null
  let suffix: string | null = null

  let newTitle: string | null = null
  let newAuthor: string | null = null
  let searched = false

  $: mode = $focusedBook.existsInDatabase ? VALID_MODE.DISPLAY : VALID_MODE.CREATE
  $: searched = $focusedBook.title ? true : false
  const addBookClicked = () => {
    createShipment.addContent('book', $focusedBook as Book)
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

  const shouldDisableAddBookToDatabaseThenPackage = (
    creatorType,
    prefix,
    firstName,
    middleName,
    lastName,
    suffix,
  ) =>
    isEmpty(creatorType) ||
    (creatorType == 'author' &&
      isEmpty(prefix) &&
      isEmpty(firstName) &&
      isEmpty(middleName) &&
      isEmpty(lastName) &&
      isEmpty(suffix))

  const shouldDisableEditAndAdd = (isbn, newAuthor, newTitle) =>
    isEmpty(isbn) ||
    (isbn.length !== 10 && isbn.length !== 13) ||
    isEmpty(newAuthor) ||
    isEmpty(newTitle)

  const addToDatabaseAndPackage = async () => {
    let author
    if (creatorType == 'author') {
      author = {
        type: 'author',
        prefix: prefix,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        suffix: suffix,
      }
    } else {
      author = { type: 'group', name: $focusedBook.unclearAuthors[0].name }
    }
    let bookToSend = {
      isbn10: $focusedBook.isbn10,
      isbn13: $focusedBook.isbn13,
      title: $focusedBook.title,

      creators: [author],
      id: null,
    }
    let book = await BookService.createBook(bookToSend as Book)
    createShipment.addContent('book', book)
    dispatch('add-book', book)
  }
  const editAndAdd = async (isbn, newAuthor, newTitle) => {
    focusedBook.set({
      id: null,
      type: 'book',
      title: newTitle,
      creators: [
        {
          type: 'author',
          firstName: newAuthor.split(' ')[0],
          lastName: newAuthor.split(' ')[1],
        } as Author,
      ],
    })
    if (isbn.length === 10) {
      $focusedBook.isbn10 = isbn
    } else if (isbn.length === 13) {
      $focusedBook.isbn13 = isbn
    }
    await focusedBook.sync()
    createShipment.addContent('book', $focusedBook as Book)

    dispatch('add-book', $focusedBook)
  }
</script>

{#if mode === VALID_MODE.DISPLAY && $focusedBook.existsInDatabase && !$focusedBook.needsAuthorAssistance}
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
    <strong>{$focusedBook.title}</strong>
    {$focusedBook.authors}

    <p>Add it to the package by clicking the button below, or search for another book instead.</p>

    <div class="form-options">
      <button class="success" on:click={addBookClicked}>Add book to package</button>
      <button class="danger" on:click={editBookClicked}>Edit book info</button>
      <button on:click={searchClicked}>Nevermind, search for different book</button>
      <button on:click={cancelClicked}>Cancel</button>
    </div>
  </section>
{/if}
{#if $focusedBook.needsAuthorAssistance}
  <form class="book-flow" on:submit|preventDefault={() => addToDatabaseAndPackage()}>
    <p>
      We found a book with ISBN-10 <strong>{$focusedBook.isbn10}</strong> and ISBN-13
      <strong>{$focusedBook.isbn13}</strong>, but need some help with the creator.
      <br />
    </p>
    {#each $focusedBook.unclearAuthors as group}
      <p>
        Is '{group.name}' an author, or a group?
      </p>
      <div>
        <div style="display:inline-block;">
          <label style="float: left; margin-right: 10px">
            <input type="radio" bind:group={creatorType} name="creatorType" value={'author'} />
            Author
          </label>
        </div>
        <div style="display:inline-block;">
          <label style="float: left; margin-right: 10px">
            <input type="radio" bind:group={creatorType} name="creatorType" value={'group'} />
            Group
          </label>
        </div>
      </div>
      {#if creatorType == 'author'}
        Please fill out the following for the author {group.name} then click "Add book to package".
        <input type="text" placeholder="Prefix" bind:value={prefix} />
        <input type="text" placeholder="First name" bind:value={firstName} />
        <input type="text" placeholder="Middle Name" bind:value={middleName} />
        <input type="text" placeholder="Last Name" bind:value={lastName} />
        <input type="text" placeholder="Suffix" bind:value={suffix} />
      {/if}
      {#if creatorType == 'group'}
        Great! Click "Add book to package".
      {/if}
    {/each}
    <div class="form-options">
      <button
        class="success"
        disabled={shouldDisableAddBookToDatabaseThenPackage(
          creatorType,
          prefix,
          firstName,
          middleName,
          lastName,
          suffix,
        )}>Add book to package</button
      >
      <button on:click={searchClicked}>Nevermind, search for different book</button>
      <button on:click={cancelClicked}>Cancel</button>
    </div>
  </form>
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

{#if !searched}
  Searching!
{/if}

{#if mode === VALID_MODE.CREATE && isbn && !$focusedBook.needsAuthorAssistance && searched}
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

  button {
    flex-grow: 1;
  }
</style>
