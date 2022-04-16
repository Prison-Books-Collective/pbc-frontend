<script lang="ts" context="module">
	import { getQueryParam } from '$util/web';
	import { HomepageSearch } from '$util/routing';

	export function load({ url }) {
		const mode = getQueryParam(url, 'search mode', 'search', 'mode') || HomepageSearch.ID;

		return { props: { mode } };
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { gotoHomeSearch, gotoInmateSearch } from '$util/routing';
	import { isEmpty } from '$util/strings';
	import PackageCount from '$components/package/package-count.svelte';

	export let mode: HomepageSearch = HomepageSearch.ID;
	let focusOnLoadElement;

	let inmateID = null;
	let firstName = null;
	let lastName = null;

	onMount(() => {
		focusOnLoadElement.focus();
	});

	const shouldDisableSearch = (firstName, lastName) => isEmpty(firstName) && isEmpty(lastName);
	const toggleSearch = (mode) =>
		gotoHomeSearch(mode === HomepageSearch.ID ? HomepageSearch.NAME : HomepageSearch.ID);

	$: searchText = mode === HomepageSearch.ID ? 'Search by Name?' : 'Search by Inmate ID?';
</script>

<svelte:head>
	<title>BellBooks - Search</title>
</svelte:head>

<main class="page">
	<form
		on:submit|preventDefault={() => gotoInmateSearch(mode, { id: inmateID, firstName, lastName })}
	>
		{#if mode === HomepageSearch.ID}
			<input
				id="inmate-id"
				type="text"
				placeholder="Enter Inmate ID #, press Enter"
				name="inmateNumber"
				class="big"
				bind:value={inmateID}
				bind:this={focusOnLoadElement}
			/>
		{:else if mode === HomepageSearch.NAME}
			<input
				id="inmateFirstName"
				type="text"
				name="inmateFirstName"
				placeholder="First Name"
				class="big"
				bind:value={firstName}
				bind:this={focusOnLoadElement}
			/>

			<input
				id="inmateLastName"
				type="text"
				name="inmateLastName"
				placeholder="Last Name"
				class="big"
				bind:value={lastName}
			/>

			<button type="submit" class="slim" disabled={shouldDisableSearch(firstName, lastName)}>
				Find Inmate(s)
			</button>
		{/if}
	</form>

	<p class="link" on:click={() => toggleSearch(mode)}>
		{searchText}
	</p>

	<PackageCount />
</main>

<style>
	button {
		align-self: center;
	}
</style>
