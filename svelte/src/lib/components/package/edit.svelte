<script lang="ts">
	import { newPackage } from '$lib/stores/package';

	let selectedItems = [];

	$: shouldDisableSelectionOptions = () => {
		return !selectedItems || selectedItems.length === 0;
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

	{JSON.stringify(selectedItems)}

	<nav class="package-options">
		<button>Add Items</button>
		<button disabled={shouldDisableSelectionOptions()}>Delete Selected Item(s)</button>
		<button class="button-danger">Delete Entire Package</button>
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
