<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { focusedInmate, focusedInmatePackages } from '$lib/stores/inmate';
	import type { Package } from '$lib/services/pbc-service/models/package';

	import Book from '$lib/components/book.svelte';
	import Zine from '$lib/components/zine.svelte';
	import editIcon from '$lib/assets/icons/edit.png';
	import printIcon from '$lib/assets/icons/print.png';

	const dispatch = createEventDispatcher();

	export let inmateID: string | number = null;
	if (inmateID) {
		focusedInmate.fetch(inmateID);
	}

	const alertPackageClicked = (pbcPackage: Package) => {
		dispatch('alert', pbcPackage);
	};
	const editPackageClicked = (pbcPackage: Package) => {
		dispatch('edit', pbcPackage);
	};
	const printPackageClicked = (pbcPackage: Package) => {
		dispatch('print', pbcPackage);
	};
</script>

<section id="package-table-container">
	{#await $focusedInmatePackages}
		<h1>Loading Packages</h1>
	{:then packages}
		{#if packages.length === 0}
			<h2 class="no-packages-message">
				No packages have been created for {$focusedInmate.firstName}
				{$focusedInmate.lastName} yet
			</h2>
		{:else}
			<table id="packageTable">
				<tr>
					<th>!</th>
					<th>Package</th>
					<th>Edit</th>
					<th>Print</th>
				</tr>

				{#each packages as pbcPackage, index}
					<tr class:darkRow={!(index % 2)}>
						<td class="spacer-col">
							{#if pbcPackage.alert}
								<abbr
									class="alert"
									title={pbcPackage.alert.information}
									on:click={() => alertPackageClicked(pbcPackage)}
								>
									!
								</abbr>
							{/if}
						</td>
						<td class="package-col">
							<h2>
								{#if pbcPackage.facility}
									<em class="facility-name">{pbcPackage.facility.facility_name}</em>,
								{/if}
								<date>
									{pbcPackage.date}:
								</date>
							</h2>
							<ul>
								{#each pbcPackage.books as book}
									<li>
										<Book {book} />
									</li>
								{/each}
								{#each pbcPackage.noISBNBooks as book}
									<li>
										<Book {book} />
									</li>
								{/each}
								{#each pbcPackage.zines as zine}
									<li>
										<Zine {zine} />
									</li>
								{/each}
							</ul>
						</td>
						<td class="edit-col">
							<img
								src={editIcon}
								alt="edit icon; click to edit this package"
								class="edit-icon"
								width="20"
								height="20"
								on:click={() => editPackageClicked(pbcPackage)}
							/>
						</td>
						<td class="print-col">
							<img
								src={printIcon}
								alt="print icon; click to print this package"
								class="print-icon"
								width="20"
								height="20"
								on:click={() => printPackageClicked(pbcPackage)}
							/>
						</td>
					</tr>
				{/each}
			</table>
		{/if}
	{/await}
</section>

<style lang="scss">
	#package-table-container {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: stretch;
	}

	table {
		width: 100%;
		max-width: 800px;
	}

	h2 {
		font-size: 1rem;
		margin-bottom: 0;
		margin-top: 0;
	}

	.alert {
		cursor: pointer;
		text-decoration: underline;
		color: blue;
		width: 10px;
		text-align: center;
	}

	.facility-name {
		font-weight: normal;
	}

	.no-packages-message {
		margin-top: 3em;
	}

	.darkRow {
		background-color: gainsboro;
	}
	.spacer-col {
		padding: 10px 13px;
	}
	.package-col {
		padding-top: 10px;
		padding-bottom: 10px;
		padding-right: 15px;
		padding-left: 20px;
		text-align: left;
	}
	.edit-col {
		text-align: center;
		width: 40px;
	}
	.print-col {
		text-align: center;
		width: 40px;
	}

	.edit-icon,
	.print-icon {
		transition-duration: 0.3s;
		opacity: 0.5;
		cursor: pointer;

		&:hover {
			opacity: 0.9;
		}
	}
</style>
