<script lang="ts">
	import { focusedInmate } from '$lib/stores/inmate';
	import { newPackage } from '$lib/stores/package';
	import { FacilityService } from '$lib/services/pbc-service/facility.service';

	import FacilitySelect from '$lib/components/facility/select.svelte';

	let facility = $newPackage.facility;
	(async () => {
		if (!facility && $focusedInmate.location) {
			facility = await FacilityService.resolveFacilityByName($focusedInmate.location);
		}
	})();

	const isPackageEmpty = () =>
		$newPackage.books.length === 0 &&
		$newPackage.noISBNBooks.length === 0 &&
		$newPackage.zines.length === 0;

	$: shouldDisableComplete = () => !facility;
</script>

<section class="package-overview">
	<h1>Package Contents</h1>
	{#if isPackageEmpty()}
		<p>
			<em>There are currently no items in this package</em>
		</p>
	{:else}
		<ol class="package-items-list">
			{#each $newPackage.books as book}
				<li>
					<em>{book.title}</em> &mdash; {book.authors.join(', ')}
				</li>
			{/each}
			{#each $newPackage.noISBNBooks as book}
				<li>
					<em>{book.title}</em> &mdash; {book.authors.join(', ')}
				</li>
			{/each}
			{#each $newPackage.zines as zine}
				<li>
					<strong>{zine.threeLetterCode}</strong> &mdash; {zine.title}
				</li>
			{/each}
		</ol>
	{/if}

	<div class="package-destination">
		<span class="label">Destination: </span>
		<FacilitySelect bind:facility selected={facility?.facility_name} />
	</div>
	<hr width="100%" />

	{#if isPackageEmpty()}
		<p>
			Add one or more books or zines to start a package for {$focusedInmate.firstName}
			{$focusedInmate.lastName}
		</p>
	{:else}
		<p>
			Would you like to add another book, or zine(s)? If you're finished,
			{#if !facility}
				select a <strong>destination facility</strong>, and then
			{/if}
			click Complete Package
		</p>
	{/if}

	<nav class="package-options">
		<button>Add Book</button>
		<button>Add Zine(s)</button>
		{#if !isPackageEmpty()}
			<button class="button-success" disabled={shouldDisableComplete()}>Complete Package</button>
		{/if}
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

	.package-items-list {
		text-align: left;
	}

	.package-destination {
		display: flex;
		flex-flow: row nowrap;
		align-items: baseline;
		justify-content: space-between;

		.label {
			font-family: Roboto;
			font-weight: 600;
			margin-right: 1em;
		}
	}

	.package-options {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-around;
		align-items: center;
	}

	h1 {
		text-decoration: underline;
		font-weight: normal;
	}
</style>
