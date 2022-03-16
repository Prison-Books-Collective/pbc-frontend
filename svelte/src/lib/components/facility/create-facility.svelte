<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { facilities } from '$lib/stores/facility';
	import { FacilityType, State } from '$lib/services/pbc-service/models/facility';

	const dispatch = createEventDispatcher();

	export let facilityName = null;
	export let facilityType: FacilityType = null;
	export let state: State = null;

	const resetInput = () => {
		[facilityName, facilityType, state] = [null, null, null];
	};

	$: shouldDisableCreate =
		!facilityName || !facilityType || !state || facilityName.trim().length === 0;
	$: createFacility = async () => {
		try {
			const createdFacility = await facilities.create({ facilityName, facilityType, state });
			resetInput();
			dispatch('update', createdFacility);
		} catch (error) {
			dispatch('error', error);
		}
	};
</script>

<section>
	<h2>Add New Facility</h2>
	<form id="new-facility-form" on:submit|preventDefault={createFacility}>
		<label for="facility-name">
			Facility Name:
			<input type="text" name="facility-name" id="facility-name" bind:value={facilityName} />
		</label>

		<select bind:value={state}>
			<option disabled selected value={null}>State of Operation</option>
			{#each Object.values(State) as s}
				<option value={s}>{s}</option>
			{/each}
		</select>

		<select bind:value={facilityType}>
			<option disabled selected value={null}>Facility Type</option>
			{#each Object.values(FacilityType) as f}
				<option value={f}>{f}</option>
			{/each}
		</select>

		<button disabled={shouldDisableCreate} class="button-success">Add Facility</button>
	</form>
</section>

<style>
	h2 {
		font-weight: 600;
		font-size: 1.25rem;
		color: darkslategray;
		text-align: center;
	}

	form {
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: stretch;
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

	select {
		background: none;
		appearance: none;
		-moz-appearance: none;
		-webkit-appearance: none;

		font-size: 1rem;
		padding: 0.5rem;
		margin-bottom: 1rem;

		border: 1px solid rgba(0, 0, 0, 0.3);
		border-radius: 3px;

		width: 100%;
	}
</style>
