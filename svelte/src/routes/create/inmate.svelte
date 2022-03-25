<script lang="ts" context="module">
	export function load({ url }) {
		const id = url.searchParams.get('id') || null;
		let firstName = url.searchParams.get('firstName') || url.searchParams.get('first_name') || null;
		let lastName = url.searchParams.get('lastName') || url.searchParams.get('last_name') || null;

		if (firstName === 'null') firstName = null;
		if (lastName === 'null') lastName = null;

		return { props: { id, firstName, lastName, wasIDProvided: !!id } };
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { ROUTE_PACKAGES_FOR_INMATE } from '$util/routing';
	import { focusedInmate } from '$stores/inmate';
	import type { Facility } from '$models/pbc/facility';
	import { InmateService } from '$services/pbc/inmate.service';
	import FacilitySelect from '$components/facility/select.svelte';

	export let id = null;
	export let firstName = null;
	export let lastName = null;
	export let wasIDProvided = false;
	let location: Facility = null;

	$: shouldDisableCreateInmate = () => !firstName || !lastName || (!location && !id);
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
			goto(ROUTE_PACKAGES_FOR_INMATE(createdInmate.id));
		}
	};
</script>

<svelte:head>
	<title>BellBooks - Register Inmate</title>
</svelte:head>

<main class="svelte-page">
	<h1>Add New Inmate</h1>

	<form on:submit|preventDefault={createInmate}>
		{#if wasIDProvided}
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

		{#if !wasIDProvided}
			<FacilitySelect bind:facility={location} />
		{/if}

		<button type="submit" class="button-success" disabled={shouldDisableCreateInmate()}>
			Add Inmate
		</button>
	</form>
</main>

<style lang="scss">
	form {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: stretch;
		max-width: 500px;
	}

	label {
		width: 100%;
		margin-bottom: 1.5em;
		text-align: left;
		font-weight: 700;
	}

	input[type='text'] {
		padding: 0.5em;
		width: 95%;
		max-width: auto;
		font-size: 1rem;
		background: none;
		border: 1px solid rgba(0, 0, 0, 0.3);
		border-radius: 3px;
	}
</style>
