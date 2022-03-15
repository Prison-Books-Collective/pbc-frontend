<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { focusedBook } from '$lib/stores/book';

	const dispatch = createEventDispatcher();

	let scanInput;
	let inputISBN;

	onMount(() => {
		scanInput.focus();
	});

	const cancelClicked = () => dispatch('cancel');
	const searchClicked = () => dispatch('search', inputISBN);
	const noISBNClicked = () => dispatch('no-isbn');

	$: shouldDisableSearch = () => {
		return !inputISBN || (inputISBN.length !== 10 && inputISBN.length !== 13);
	};
	$: loadISBN = () => {
		focusedBook.fetch(inputISBN);
	};
</script>

<form id="search-book" on:submit|preventDefault={loadISBN}>
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

	<div class="options">
		<button on:click={searchClicked} class="button-success" disabled={shouldDisableSearch()}>
			Search for Book
		</button>
		<button on:click={noISBNClicked} class="button-danger" type="button">No ISBN?</button>
		<button on:click={cancelClicked} type="button">Cancel</button>
	</div>
</form>

<style lang="scss">
	#search-book {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: stretch;
	}

	.options {
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
