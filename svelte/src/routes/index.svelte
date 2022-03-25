<script lang="ts">
	import { onMount } from 'svelte';
	import { VALID_HOMEPAGE_SEARCH, gotoSearchForInmate } from '$util/routing';
	import { isEmpty } from '$util/strings';
	import PackageCount from '$components/package/package-count.svelte';
	import { uriQueryJoin } from '$util/web';

	let id = null;
	let firstName = null;
	let lastName = null;

	let searchByIdElement;
	let searchBy = VALID_HOMEPAGE_SEARCH.ID;

	onMount(() => {
		searchByIdElement.focus();
	});

	$: searchText =
		searchBy === VALID_HOMEPAGE_SEARCH.ID ? 'Search by Name?' : 'Search by Inmate ID?';
	$: toggleSearch = () =>
		(searchBy =
			searchBy === VALID_HOMEPAGE_SEARCH.ID
				? VALID_HOMEPAGE_SEARCH.NAME
				: VALID_HOMEPAGE_SEARCH.ID);
	$: shouldDisableSearch = () => isEmpty(firstName) && isEmpty(lastName);
</script>

<svelte:head>
	<title>BellBooks - Search</title>
</svelte:head>

<main class="svelte-page">
	<form on:submit|preventDefault={() => gotoSearchForInmate(searchBy, { id, firstName, lastName })}>
		{#if searchBy === VALID_HOMEPAGE_SEARCH.ID}
			<input
				id="inmate-id"
				type="text"
				placeholder="Enter Inmate ID #, press Enter"
				name="inmateNumber"
				bind:value={id}
				bind:this={searchByIdElement}
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

		#inmate-id {
			outline: none;
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
		font-size: 1rem;
		position: relative;
	}

	#toggle-search::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 1px;
		bottom: -2px;
		background-color: blue;

		transition: transform 250ms ease-in-out;
		transform: scale(0);
	}

	#toggle-search:hover::before,
	#toggle-search:focus-visible::before {
		transform: scale(1);
	}
</style>
