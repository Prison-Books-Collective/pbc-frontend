<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { focusedBook } from '$lib/stores/book';
	import { focusedPackage } from '$lib/stores/package';

	const dispatch = createEventDispatcher();
	enum VALID_MODE {
		DISPLAY,
		EDIT,
		CREATE,
		CREATE_NO_ISBN
	}

	let mode = VALID_MODE.DISPLAY;

	let newISBN;
	let newTitle;
	let newAuthor;

	const addBookClicked = () => {
		focusedPackage.addBook($focusedBook);
		dispatch('add-book', $focusedBook);
	};

	const editBookClicked = () => {
		mode = VALID_MODE.EDIT;
		newISBN = $focusedBook.isbn10 || $focusedBook.isbn13 || null;
		newTitle = $focusedBook.title;
		newAuthor = $focusedBook.authors ? $focusedBook.authors.join(', ') : null;
	};

	const cancelClicked = () => dispatch('cancel');
	const cancelEditClicked = () => {
		mode = VALID_MODE.DISPLAY;
	};
	const searchClicked = () => dispatch('search');

	$: shouldDisableEditAndAdd = () => {
		return !newISBN || (newISBN.length !== 10 && newISBN.length !== 13) || !newAuthor || !newTitle;
	};
	$: editAndAdd = () => {
		$focusedBook.title = newTitle;
		$focusedBook.authors = newAuthor.split(',').map((author) => author.trim());
		if (newISBN.length === 10) {
			$focusedBook.isbn10 = newISBN;
		} else if (newISBN.length === 13) {
			$focusedBook.isbn13 = newISBN;
		}
		focusedBook.sync();
		focusedPackage.addBook($focusedBook);

		dispatch('add-book', $focusedBook);
	};
</script>

<p>
	{JSON.stringify($focusedBook)}
</p>

<!-- case: success, found book -->
{#if mode === VALID_MODE.DISPLAY && $focusedBook.existsInDatabase}
	<section class="book-flow">
		<p>
			We found a book that matched
			{#if $focusedBook.isbn10}
				ISBN10: <strong>{$focusedBook.isbn10}</strong>
			{/if}
			{#if $focusedBook.isbn10 && $focusedBook.isbn13}
				and
			{/if}
			{#if $focusedBook.isbn13}
				ISBN13: <strong>{$focusedBook.isbn13}</strong>
			{/if}
		</p>

		{#if $focusedBook.title}
			<h1 class="book-title">
				{$focusedBook.title}
			</h1>
		{/if}
		{#if $focusedBook.authors && $focusedBook.authors.length > 0}
			<p>
				<em>
					By: {$focusedBook.authors.join(', ')}
				</em>
			</p>
			<p>Add it to the package by clicking the button below, or search for another book instead.</p>
		{/if}

		<div class="book-options">
			<button class="button-success" on:click={addBookClicked}>Add book to package</button>
			<button class="button-danger" on:click={editBookClicked}>Edit book info</button>
			<button on:click={searchClicked}>Nevermind, search for different book</button>
			<button on:click={cancelClicked}>Cancel</button>
		</div>
	</section>
{/if}

<!-- case: success, edit book -->
{#if mode === VALID_MODE.EDIT}
	<form class="book-flow" on:submit|preventDefault={editAndAdd}>
		<p>Edit the book information below, then save the book</p>

		<label for="new-isbn">
			ISBN10 or ISBN13
			<input
				type="text"
				name="new-isbn"
				id="new-isbn"
				placeholder="New ISBN"
				bind:value={newISBN}
			/>
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

		<div class="book-options">
			<button class="button-success" disabled={shouldDisableEditAndAdd()}>
				Save book and add to package
			</button>
			<button type="button" on:click={cancelEditClicked}>Cancel</button>
		</div>
	</form>
{/if}
<!-- case: success, create no-isbn book -->

<!-- case: failure, book does not exist; create book with ISBN -->
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

	label {
		width: 100%;
		margin-bottom: 1.5em;
		text-align: left;
		font-weight: 700;
	}

	input[type='text'] {
		padding: 0.5em;
		width: 95%;
		max-width: auto;
		font-size: 1rem;
		background: none;
		border: 1px solid rgba(0, 0, 0, 0.3);
		border-radius: 3px;
	}
</style>
