<script lang="ts" context="module">
	export function load({ params }) {
		const { mode } = params;
		return { props: { mode } };
	}
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { InmateService } from '$lib/services/pbc-service';
	import { FacilityService } from '$lib/services/pbc-service/facility.service';
	import { INMATE_SEARCH_MODE, ROUTE_OVERVIEW } from '$lib/util/routing';
	import { ERROR_MESSAGE_SERVER_COMMUNICATION } from '$lib/util/error';

	export let mode: INMATE_SEARCH_MODE;
	export let id = $page.url.searchParams.get('id') || null;
	export let firstName = $page.url.searchParams.get('firstName') || null;
	export let lastName = $page.url.searchParams.get('lastName') || null;
	export let location;

	let getInmates =
		mode === INMATE_SEARCH_MODE.DISAMBIGUATION
			? InmateService.getInmateNoIdByName({ firstName, lastName })
			: Promise.resolve([]);

	let getFacilities = FacilityService.getAllFacilities();

	const wasIDProvided = () => {
		return $page.url.searchParams.get('id') != null;
	};

	const createInmate = async () => {
		let createInmate;
		if (id) {
			createInmate = InmateService.createInmate({
				firstName,
				lastName,
				inmateId: id
			});
		} else {
			createInmate = InmateService.createInmateNoID({
				firstName,
				lastName,
				location
			});
		}

		try {
			const createdInmate = await createInmate;
			goto(ROUTE_OVERVIEW(createdInmate.id));
			return;
		} catch (error) {
			alert(ERROR_MESSAGE_SERVER_COMMUNICATION);
			console.error(error);
		}
	};
</script>

<main>
	{#if mode === INMATE_SEARCH_MODE.CREATE}
		<h1>Add New Inmate</h1>

		<form on:submit|preventDefault={createInmate}>
			{#if wasIDProvided()}
				<input
					type="text"
					name="inmateNumber"
					id="inmateNumber"
					placeholder="Inmate ID Number"
					bind:value={id}
				/>
			{/if}
			<input
				type="text"
				name="firstName"
				id="firstName"
				placeholder="First Name"
				bind:value={firstName}
			/>
			<input
				type="text"
				name="lastName"
				id="lastName"
				placeholder="Last Name"
				bind:value={lastName}
			/>
			{#if !wasIDProvided()}
				<select bind:value={location}>
					{#await getFacilities}
						<option value={undefined}>Loading Facilities</option>
					{:then facilities}
						<option disabled selected value={null}>Select Facility</option>
						{#each facilities as facility}
							<option value={facility}>{facility.facility_name}</option>
						{/each}
					{/await}
				</select>
			{/if}

			<button type="submit" disabled={!firstName || !lastName || (!location && !id)}>
				Add Inmate
			</button>
		</form>
	{:else if mode === INMATE_SEARCH_MODE.DISAMBIGUATION}
		<h1>Inmate Selection</h1>
		<p>
			The following inmates with this name were found, please select which inmate you're creating a
			package for:
		</p>

		{#await getInmates}
			<p>Loading...</p>
		{:then inmates}
			<nav>
				{#each inmates as inmate}
					<p>
						<a href={ROUTE_OVERVIEW(inmate.id)}>
							<strong>{inmate.location}</strong> -
							{inmate.firstName}
							{inmate.middleInitial ? inmate.middleInitial + '. ' : ''}{inmate.lastName}
						</a>
					</p>
				{/each}

				<p class="createNew">
					<a href={`/inmate/create?firstName=${firstName}&lastName=${lastName}`}>
						Click here to create a new inmate record
					</a>
				</p>
			</nav>
		{/await}
	{/if}
</main>

<style lang="scss">

	.createNew {
		margin-top: 3em;
		text-align: center;
	}
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

		select {
			appearance: none;

			-moz-appearance: none;
			border-radius: 3px;
			box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
			padding: 0.5rem;

			background-color: transparent;
			border: none;
			font-size: 1.5rem;
			text-align-last: center;
			-moz-text-align-last: center;
			-ms-text-align-last: center;
			margin-bottom: 1rem;

			option {
				text-align: center;
			}
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
</style>
