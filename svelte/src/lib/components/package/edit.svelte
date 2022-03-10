<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { PackageService } from '$lib/services/pbc-service/package.service';

	import { newPackage } from '$lib/stores/package';

	const dispatch = createEventDispatcher();

	let selectedItems = [];

	$: shouldDisableSelectionOptions = () => {
		return !selectedItems || selectedItems.length === 0;
	};

	const deleteItems = () => {
		try {
			newPackage.removeItemsById(...selectedItems);
			const updatedPackage = PackageService.updatePackage($newPackage);
			dispatch('update', updatedPackage);
			selectedItems = [];
		} catch (error) {
			console.error(`failed to delete items: [${selectedItems.join(', ')}]`, error);
			dispatch('error', error);
		}
	};

	const deletePackage = () => {
		const shouldDelete = confirm('Are you sure you want to delete this entire package?');
		if (shouldDelete) {
			try {
				PackageService.deletePackage($newPackage.id);
				dispatch('update', {});
			} catch (error) {
				console.error(`failed to delete package with ID "${$newPackage.id}"`, error);
				dispatch('error', error);
			}
		}
	};
</script>

<section class="package-overview">
	<!-- {JSON.stringify($newPackage)} -->

	<h1>Edit Package</h1>
	<p>Select item(s) to edit or delete, or delete the whole package.</p>
	<p>Changes you make to the titles or authors of items will affect the entire database.</p>
	<hr width="100%" />

	<div class="package-contents">
		{#each $newPackage.books as book}
			<label for={book.id.toString()}>
				<input
					type="checkbox"
					name={book.id.toString()}
					id={book.id.toString()}
					bind:group={selectedItems}
					value={book.id}
				/>
				<em>{book.title}</em> &mdash; {book.authors.join(', ')}
			</label>
		{/each}
		{#each $newPackage.noISBNBooks as book}
			<label for={book.id.toString()}>
				<input
					type="checkbox"
					name={book.id.toString()}
					id={book.id.toString()}
					bind:group={selectedItems}
					value={book.id}
				/>
				<em>{book.title}</em> &mdash; {book.authors.join(', ')}
			</label>
		{/each}
		{#each $newPackage.zines as zine}
			<label for={zine.id.toString()}>
				<input
					type="checkbox"
					name={zine.id.toString()}
					id={zine.id.toString()}
					bind:group={selectedItems}
					value={zine.id}
				/>
				<strong>{zine.threeLetterCode}</strong> &mdash; {zine.title}
			</label>
		{/each}
	</div>

	<nav class="package-options">
		<button>Add Items</button>
		<button disabled={shouldDisableSelectionOptions()} on:click={() => deleteItems()}
			>Delete Selected Item(s)</button
		>
		<button class="button-danger" on:click={() => deletePackage()}>Delete Entire Package</button>
	</nav>
</section>

<style lang="scss">
	.package-overview {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: stretch;
		text-align: center;
	}

	.package-contents {
		width: 100%;
		text-align: left;
	}

	.package-options {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-around;
		align-items: center;
	}

	p {
		margin: 0.3em;
	}

	label {
		display: block;
		width: 100%;
		margin-bottom: 0.5em;
	}
</style>
