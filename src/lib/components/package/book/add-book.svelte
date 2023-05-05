<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'
  import { focusedBook } from '$stores/book'
  import { focusedPackage } from '$stores/package'
  import type { Book } from '$models/pbc/shipment'
  import { BookService } from '$services/pbc/book.service'

  enum DISPLAY_FORM {
    WITH_ISBN,
    WITHOUT_ISBN,
  }

  const dispatch = createEventDispatcher()

  export let display: DISPLAY_FORM = DISPLAY_FORM.WITH_ISBN
  let creatorType = null

  let prefix = null
  let firstName = null
  let middleName = null
  let lastName = null
  let suffix = null
  let groupName = null
  let scanInput
  let inputISBN
  let inputTitle

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
      author = { type: 'group', name: groupName }
    }
    let bookToSend = {
      title: inputTitle,

      creators: [author],
      id: null,
    }
    let book = await BookService.createBook(bookToSend as Book)
    focusedPackage.addBook(book)
    dispatch('update', book)
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
    <p>Is the creator an author, or a group?</p>
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
      Please fill out the following for the author then click "Add book to package".
      <input type="text" placeholder="Prefix" bind:value={prefix} />
      <input type="text" placeholder="First name" bind:value={firstName} />
      <input type="text" placeholder="Middle Name" bind:value={middleName} />
      <input type="text" placeholder="Last Name" bind:value={lastName} />
      <input type="text" placeholder="Suffix" bind:value={suffix} />
    {/if}
    {#if creatorType == 'group'}
      <input type="text" placeholder="Group name" bind:value={groupName} />
    {/if}

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
