<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';

	import { newPackage } from '$lib/stores/package';
	import { ZineService } from '$lib/services/pbc-service/zine.service';
	import type { Zine } from '$lib/services/pbc-service/models/zine';

	const dispatch = createEventDispatcher();

	let filter: string = '';
	let getZines = ZineService.getZines();
	let addZines: Zine[] = [];
	let allZines: Zine[] = [];
	let availableZines: Zine[] = [];
	(async () => {
		allZines = await getZines;
		availableZines = allZines.filter((z) => !$newPackage.zines.includes(z));
	})();

	$: availableZines = allZines.filter((z) => {
		if ($newPackage.zines.includes(z)) return false;
		if (filter == '') return true;

		filter = filter.toLowerCase();
		const threeLetterCode = z.threeLetterCode.toLowerCase();
		const title = z.title.toLowerCase();

		return threeLetterCode.includes(filter) || title.includes(filter);
	});

	const cancelClicked = () => dispatch('cancel');
	$: addClicked = () => {
		addZines.forEach((z) => newPackage.addZine(z));
		dispatch('add-zines', addZines);
		addZines = [];
	};
	$: shouldDisableAdd = () => !addZines || addZines.length === 0;
</script>

<section class="add-zine">
	<h1>Add Zines</h1>
	<p>Select the zine(s) you are sending from the following list, then click "Add to Package"</p>

	{#if availableZines}
		<div class="add-zine-list">
			<input
				class="filter-input"
				type="text"
				name="filter"
				placeholder="Filter Zine List"
				bind:value={filter}
			/>
			{#each availableZines as zine}
				<label for={zine.id.toString()} transition:fly|local={{ duration: 300, x: -50 }}>
					<input type="checkbox" id={zine.id.toString()} value={zine} bind:group={addZines} />
					<strong>
						{zine.threeLetterCode}
					</strong>
					&mdash;
					{zine.title}
				</label>
			{/each}
		</div>
	{/if}

	<div class="add-zine-options">
		<button disabled={shouldDisableAdd()} on:click={addClicked} class="button-success"
			>Add to Package</button
		>
		<button on:click={cancelClicked}>Cancel</button>
	</div>
</section>

<style lang="scss">
	.add-zine {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: stretch;
		text-align: center;
	}

	.add-zine-options {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
	}

	.add-zine-list {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: stretch;

		max-height: 30ch;
		max-width: 100%;
		overflow-x: hidden;
		overflow-y: scroll;
		margin: 1em;
		padding: 1em;

		border-radius: 3px;
		border: rgba(0, 0, 0, 0.3) solid 1px;

		text-align: left;
	}

	label {
		display: block;
	}

	.filter-input {
		background: none;
		font-size: 1.25rem;
		padding: 0.25em;
		margin-bottom: 0.5em;
	}
</style>
