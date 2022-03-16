<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { focusedPackage } from '$lib/stores/package';
	import Book from '$lib/components/book.svelte';
	import Zine from '$lib/components/zine/zine.svelte';

	const dispatch = createEventDispatcher();

	const doneClicked = () => dispatch('done');
	const printClicked = () => dispatch('print');
</script>

{#if $focusedPackage.id}
	<section id="package-success">
		<h1>Package Contents:</h1>

		<ol class="package-items-list">
			{#each $focusedPackage.books as book}
				<li>
					<Book {book} />
				</li>
			{/each}
			{#each $focusedPackage.noISBNBooks as book}
				<li>
					<Book {book} />
				</li>
			{/each}
			{#each $focusedPackage.zines as zine}
				<li>
					<Zine {zine} />
				</li>
			{/each}
		</ol>
		<hr />

		<div id="print-options">
			<button class="button-success" on:click={printClicked}>Print Invoice?</button>
			<button on:click={doneClicked}>Done</button>
		</div>
	</section>
{/if}

<style lang="scss">
	#package-success {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: center;
	}

	h1 {
		font-weight: normal;
		text-decoration: underline;
	}

	hr {
		width: 100%;
	}

	.package-items-list {
		text-align: left;
	}
</style>
