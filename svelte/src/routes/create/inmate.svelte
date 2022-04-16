<script lang="ts" context="module">
	import { getQueryParam } from '$lib/util/web';

	export function load({ url }) {
		const id = url.searchParams.get('id') || null;
		let firstName = getQueryParam(url, 'first name');
		let lastName = getQueryParam(url, 'last name');

		return { props: { id, firstName, lastName, isInmateNoID: !id } };
	}
</script>

<script lang="ts">
	import { gotoPackagesForInmate } from '$util/routing';
	import { focusedInmate } from '$stores/inmate';
	import type { Facility } from '$models/pbc/facility';
	import { InmateService } from '$services/pbc/inmate.service';
	import FacilitySelect from '$components/facility/select-facility.svelte';
	import { isEmpty } from '$util/strings';

	export let id = null;
	export let firstName = null;
	export let lastName = null;
	export let isInmateNoID = true;
	export let location: Facility = null;

	const shouldDisableCreateInmate = ({ isInmateNoID, firstName, lastName, location, id }) =>
		isInmateNoID
			? isEmpty(firstName) || isEmpty(lastName) || !location
			: isEmpty(firstName) || isEmpty(lastName) || isEmpty(id);

	const createInmate = async () => {
		let createdInmate;
		if (!id && !!location) {
			createdInmate = await InmateService.createInmateNoID({ firstName, lastName, location });
		}
		if (!!id && !location) {
			createdInmate = await InmateService.createInmate({ firstName, lastName, inmateId: id });
		}

		if (!!createdInmate && !!createdInmate.id) {
			focusedInmate.set(createdInmate);
			gotoPackagesForInmate(createdInmate.id);
		}
	};
</script>

<svelte:head>
	<title>BellBooks - Register Inmate</title>
</svelte:head>

<main class="page">
	<h1>Add New Inmate</h1>

	<form on:submit|preventDefault={createInmate}>
		<label for="no-id" class="checkbox">
			<input type="checkbox" name="no-id" id="no-id" bind:checked={isInmateNoID} />
			This Inmate does not have an ID
		</label>

		{#if isInmateNoID}
			<FacilitySelect bind:facility={location} selected={location?.facility_name} />
		{:else}
			<label for="inmateNumber">
				Inmate ID
				<input
					type="text"
					name="inmateNumber"
					id="inmateNumber"
					placeholder="Inmate ID Number"
					bind:value={id}
				/>
			</label>
		{/if}

		<label for="firstName">
			First Name
			<input
				type="text"
				name="firstName"
				id="firstName"
				placeholder="First Name"
				bind:value={firstName}
			/>
		</label>

		<label for="lastName">
			Last Name
			<input
				type="text"
				name="lastName"
				id="lastName"
				placeholder="Last Name"
				bind:value={lastName}
			/>
		</label>

		<button
			type="submit"
			class="button-success slim"
			disabled={shouldDisableCreateInmate({ isInmateNoID, firstName, lastName, id, location })}
		>
			Add Inmate
		</button>
	</form>
</main>
