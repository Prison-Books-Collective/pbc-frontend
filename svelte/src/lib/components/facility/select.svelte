<script lang="ts">
	import { createEventDispatcher } from 'svelte/internal';

	import { FacilityService } from '$lib/services/pbc-service/facility.service';
	import type { Facility } from '$lib/services/pbc-service/models/facility';

	const dispatch = createEventDispatcher();
	export let facility: Facility = null;
	export let selected: string = undefined; // facility name
	let getFacilities = FacilityService.getAllFacilities();

	const emitUpdate = (newFacility: Facility) => {
		dispatch('update', newFacility);
	};
</script>

<select name="facility" bind:value={facility} on:change={() => emitUpdate(facility)}>
	{#await getFacilities}
		<option value={undefined}>Loading Facilities</option>
	{:then facilities}
		<option disabled selected={!!!selected} value={null}>Select Facility</option>
		{#each facilities as facility}
			<option value={facility} selected={selected === facility.facility_name}
				>{facility.facility_name}, {facility.state}</option
			>
		{/each}
	{/await}
</select>

<style lang="scss">
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
