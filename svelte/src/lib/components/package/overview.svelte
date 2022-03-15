<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { focusedInmate } from '$lib/stores/inmate';
	import { focusedPackage } from '$lib/stores/package';
	import { FacilityService } from '$lib/services/pbc-service/facility.service';

	import Book from '$lib/components/book.svelte';
	import Zine from '$lib/components/zine.svelte';
	import FacilitySelect from '$lib/components/facility/select.svelte';
	import { PackageService } from '$lib/services/pbc-service/package.service';
	import { isInmateNoID } from '$lib/services/pbc-service/inmate.service';

	const dispatch = createEventDispatcher();

	let removeItems = [];
	let facility = $focusedPackage.facility;
	(async () => {
		if (!facility && $focusedInmate.location) {
			facility = await FacilityService.resolveFacilityByName($focusedInmate.location);
			focusedPackage.setDestination(facility);
		}
	})();

	$: isPackageEmpty = () =>
		$focusedPackage.books.length === 0 &&
		$focusedPackage.noISBNBooks.length === 0 &&
		$focusedPackage.zines.length === 0;

	$: shouldDisableComplete = () => !facility;
	$: shouldDisableRemove = () => !removeItems || removeItems.length === 0;

	const addZinesClicked = () => dispatch('add-zines');
	const addBooksClicked = () => dispatch('add-books');
	$: completePackageClicked = async () => {
		try {
			focusedPackage.setInmate($focusedInmate);

			if ($focusedPackage.id) {
				const updatedPackage = await PackageService.updatePackage($focusedPackage);
				dispatch('update', updatedPackage);
			} else {
				const createdPackage = await PackageService.createPackage($focusedPackage);
				dispatch('update', createdPackage);
			}
		} catch (error) {
			dispatch('error', error);
			console.error('failed to update Package in database', error);
		}
	};
	const removeSelectedClicked = () => {
		focusedPackage.removeItemsById(...removeItems);
		removeItems = [];
	};
</script>

<section class="package-overview">
	<h1>Package Contents</h1>
	{#if isPackageEmpty()}
		<p>
			<em>There are currently no items in this package</em>
		</p>
	{:else}
		<ol class="package-items-list">
			{#each $focusedPackage.books as book}
				<li>
					<label for={book.id.toString()}>
						<input
							id={book.id.toString()}
							type="checkbox"
							bind:group={removeItems}
							value={book.id}
						/>
						<Book {book} />
					</label>
				</li>
			{/each}
			{#each $focusedPackage.noISBNBooks as book}
				<li>
					<label for={book.id.toString()}>
						<input
							id={book.id.toString()}
							type="checkbox"
							bind:group={removeItems}
							value={book.id}
						/>
						<Book {book} />
					</label>
				</li>
			{/each}
			{#each $focusedPackage.zines as zine}
				<li>
					<label for={zine.id.toString()}>
						<input
							id={zine.id.toString()}
							type="checkbox"
							bind:group={removeItems}
							value={zine.id}
						/>
						<Zine {zine} />
					</label>
				</li>
			{/each}
		</ol>
	{/if}

	{#if !isInmateNoID($focusedInmate) || facility}
		<div class="package-destination">
			<span class="label">Destination: </span>
			<FacilitySelect
				bind:facility
				selected={facility?.facility_name}
				on:update={({ detail }) => {
					focusedPackage.setDestination(detail);
				}}
			/>
		</div>
	{/if}
	<hr width="100%" />

	{#if isPackageEmpty()}
		<p>
			Add one or more books or zines to start a package for {$focusedInmate.firstName}
			{$focusedInmate.lastName}
		</p>
	{:else}
		<p>
			Would you like to include additional books or zines? If you're finished,
			{#if !facility}
				select a <strong>destination facility</strong>, and then
			{/if}
			click Complete Package.
		</p>
	{/if}

	<nav class="package-options">
		<button on:click={addBooksClicked}>Add Book</button>
		<button on:click={addZinesClicked}>Add Zine(s)</button>
		{#if !isPackageEmpty()}
			<button
				on:click={removeSelectedClicked}
				class="button-danger"
				disabled={shouldDisableRemove()}
			>
				Remove Selected
			</button>
		{/if}
		{#if !isPackageEmpty()}
			<button
				on:click={completePackageClicked}
				class="button-success"
				disabled={shouldDisableComplete()}
			>
				Complete Package
			</button>
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
