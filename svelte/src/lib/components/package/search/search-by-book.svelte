<script lang="ts">
	import { createEventDispatcher } from 'svelte';
  import { isEmpty } from '$util/strings';

	enum SearchType {
		ISBN,
		AUTHOR_AND_TITLE
	}

	const dispatch = createEventDispatcher();

	export let searchType: SearchType = SearchType.ISBN;
  export let isbn: string = '';
  export let author: string = '', title: string = '';

	$: submitText =
		searchType === SearchType.ISBN ? 'Search Packages by ISBN' : 'Search Packages by Author & Title';
	$: searchText =
		searchType === SearchType.ISBN
			? 'Search packages by Author & Title instead?'
			: 'Search packages by ISBN instead?';
	$: shouldDisableForm = () => {
		if (searchType === SearchType.ISBN) {
			return isEmpty(isbn) || (isbn.length !== 10 && isbn.length !== 13) || !isbn.match(/^\d+$/)
		} else {
      return isEmpty(author) || isEmpty(title)
		}
	};

	const toggleSearch = () => {
		searchType = searchType === SearchType.ISBN ? SearchType.AUTHOR_AND_TITLE : SearchType.ISBN;
	};

	const submitForm = () => {
		if (searchType === SearchType.ISBN) {
			dispatch('search', { isbn });
		} else {
			dispatch('search', { author, title });
		}
	};
</script>

<form id="isbn-search" on:submit|preventDefault={submitForm}>
	{#if searchType === SearchType.ISBN}
		<label for="isbn">
			ISBN
			<input
        id="isbn" name="isbn"
				type="text"
        placeholder="Book ISBN10 or ISBN13"
				bind:value={isbn}
			/>
		</label>
	{:else}
    <label for="author">
      Author
      <input
        id="author" name="author"
        type="text"
        placeholder="Book's Author"
        bind:value={author}
      />
    </label>

		<label for="book-title">
			Title
			<input
        id="book-title" name="book-title"
				type="text"
        placeholder="Book's Title"
				bind:value={title}
			/>
		</label>
	{/if}

	<button disabled={shouldDisableForm()} class="button-success">
		{submitText}
	</button>

	<p class="link" on:click={toggleSearch}>
		{searchText}
	</p>
</form>

<style lang="scss">
  #isbn-search {
		max-width: 400px;
		width: 100%;
	}

	label {
		display: flex;
		flex-flow: column nowrap;
		justify-content: stretch;
	}

	input[type=text] {
		width: auto;
	}

	button {
		width: 100%;
		margin: 0px;
	}

	p {
		width: fit-content;
		margin-inline: auto;
  }
</style>
