<script lang="ts">
	import { VALID_HOMEPAGE_SEARCH, gotoSearchForInmate } from '$lib/util/routing';
	import PackageCount from '$lib/components/package/package-count.svelte';

	let id = null;
	let firstName = null;
	let lastName = null;

	let searchBy = VALID_HOMEPAGE_SEARCH.ID;
	$: searchText =
		searchBy === VALID_HOMEPAGE_SEARCH.ID ? 'Search by Name?' : 'Search by Inmate ID?';
	$: toggleSearch = () =>
		(searchBy =
			searchBy === VALID_HOMEPAGE_SEARCH.ID
				? VALID_HOMEPAGE_SEARCH.NAME
				: VALID_HOMEPAGE_SEARCH.ID);
	$: shouldDisableSearch = () =>
		!firstName || !lastName || firstName.trim() === '' || lastName.trim() === '';
</script>

<svelte:head>
	<title>BellBooks - Search</title>
</svelte:head>

<main class="svelte-page">
	<form on:submit|preventDefault={() => gotoSearchForInmate(searchBy, { id, firstName, lastName })}>
		{#if searchBy === VALID_HOMEPAGE_SEARCH.ID}
			<input
				id="inmateId"
				type="text"
				placeholder="Enter Inmate ID #, press Enter"
				name="inmateNumber"
				bind:value={id}
			/>
		{:else if searchBy === VALID_HOMEPAGE_SEARCH.NAME}
			<input
				id="inmateFirstName"
				type="text"
				name="inmateFirstName"
				placeholder="First Name"
				bind:value={firstName}
			/>

			<input
				id="inmateLastName"
				type="text"
				name="inmateLastName"
				placeholder="Last Name"
				bind:value={lastName}
			/>

			<button type="submit" disabled={shouldDisableSearch()}>Search</button>
		{/if}
	</form>

	<p id="toggle-search" on:click={toggleSearch}>
		{searchText}
	</p>

	<PackageCount />
</main>

<style lang="scss">
	form {
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;

		input[type='text'] {
			background-color: transparent;
			border: none;
			font-size: 1.5rem;
			text-align: center;
			max-width: 100vw;
			width: calc(100vw - 5rem);
			margin-bottom: 1rem;
		}

		button {
			display: flex;
			flex-flow: row nowrap;
			align-items: center;
			justify-content: space-between;

			&:disabled {
				cursor: not-allowed;
			}
		}
	}

	#toggle-search {
		color: blue;
		text-decoration: underline;
		font-size: 1rem;
	}
</style>
