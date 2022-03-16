<script lang="ts" context="module">
	enum VALID_MODE {
		DISPLAY = 'display-book',
		EDIT = 'edit-book',
		CREATE = 'create-book'
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { focusedBook } from '$lib/stores/book';
	import { focusedPackage } from '$lib/stores/package';

	const dispatch = createEventDispatcher();

	export let mode = VALID_MODE.DISPLAY;
	export let isbn = null;

	let newTitle;
	let newAuthor;

	$: mode = $focusedBook.existsInDatabase ? VALID_MODE.DISPLAY : VALID_MODE.CREATE;

	const addBookClicked = () => {
		focusedPackage.addBook($focusedBook);
		dispatch('add-book', $focusedBook);
	};

	const editBookClicked = () => {
		mode = VALID_MODE.EDIT;
		isbn = $focusedBook.isbn10 || $focusedBook.isbn13 || null;
		newTitle = $focusedBook.title;
		newAuthor = $focusedBook.authors ? $focusedBook.authors.join(', ') : null;
	};

	const cancelClicked = () => dispatch('cancel');
	const cancelEditClicked = () => {
		mode = VALID_MODE.DISPLAY;
	};
	const searchClicked = () => dispatch('search');

	$: shouldDisableEditAndAdd = () => {
		return !isbn || (isbn.length !== 10 && isbn.length !== 13) || !newAuthor || !newTitle;
	};
	$: editAndAdd = async () => {
		$focusedBook.title = newTitle;
		$focusedBook.authors = newAuthor.split(',').map((author) => author.trim());
		if (isbn.length === 10) {
			$focusedBook.isbn10 = isbn;
		} else if (isbn.length === 13) {
			$focusedBook.isbn13 = isbn;
		}
		await focusedBook.sync();
		focusedPackage.addBook($focusedBook);

		dispatch('add-book', $focusedBook);
	};
</script>

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

{#if mode === VALID_MODE.EDIT}
	<form class="book-flow" on:submit|preventDefault={editAndAdd}>
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

		<div class="book-options">
			<button class="button-success" disabled={shouldDisableEditAndAdd()}>
				Save book and add to package
			</button>
			<button type="button" on:click={mode === VALID_MODE.EDIT ? cancelEditClicked : cancelClicked}
				>Cancel</button
			>
		</div>
	</form>
{/if}

{#if mode === VALID_MODE.CREATE && isbn}
	<form class="book-flow" on:submit|preventDefault={editAndAdd}>
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

		<div class="book-options">
			<button class="button-success" disabled={shouldDisableEditAndAdd()}>
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
