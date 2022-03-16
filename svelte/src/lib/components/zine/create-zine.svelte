<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { zines } from '$lib/stores/zine';

	const dispatch = createEventDispatcher();

	export let threeLetterCode = null;
	export let title = null;

	const resetInput = () => {
		[threeLetterCode, title] = [null, null];
	};

	$: shouldDisableCreate =
		!threeLetterCode ||
		!title ||
		threeLetterCode.trim().length === 0 ||
		title.trim().length === 0 ||
		threeLetterCode.length > 5;
	$: createZine = async () => {
		try {
			const createdZine = await zines.create({ threeLetterCode, title });
			resetInput();
			dispatch('update', createdZine);
		} catch (error) {
			dispatch('error', error);
		}
	};
</script>

<section>
	<h2>Add New Zine</h2>
	<form id="newZineForm" on:submit|preventDefault={createZine}>
		<label for="three-letter-code">
			Three Letter Code:
			<input
				type="text"
				name="three-letter-code"
				id="three-letter-code"
				bind:value={threeLetterCode}
			/>
		</label>

		<label for="title">
			Title:
			<input type="text" name="title" id="title" bind:value={title} />
		</label>

		<button disabled={shouldDisableCreate} class="button-success">Add Zine</button>
	</form>
</section>

<style>
	h2 {
		font-weight: 600;
		font-size: 1.25rem;
		color: darkslategray;
		text-align: center;
	}

	form {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: stretch;
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
