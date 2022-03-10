<script lang="ts">
	import { createEventDispatcher } from 'svelte/internal';
	import { InmateService, isInmateNoID } from '$lib/services/pbc-service/inmate.service';
	import { FacilityService } from '$lib/services/pbc-service/facility.service';
	import FacilitySelect from '$lib/components/facility/select.svelte';
	import { ERROR_MESSAGE_SERVER_COMMUNICATION } from '$lib/util/error';
	import { focusedInmate } from '$lib/stores/inmate';

	const dispatch = createEventDispatcher();

	export let id: string;

	let updateFirstName = $focusedInmate.firstName;
	let updateLastName = $focusedInmate.lastName;
	let updateLocation;
	(async () => {
		updateLocation = await FacilityService.resolveFacilityByName($focusedInmate.location);
	})();

	$: shouldDisableForm = () => {
		return (
			!updateFirstName ||
			updateFirstName === '' ||
			!updateLastName ||
			updateLastName === '' ||
			(isInmateNoID($focusedInmate) && !updateLocation)
		);
	};

	const updateInmateRecord = async (inmate) => {
		try {
			let createdInmate;
			if (isInmateNoID(inmate)) {
				createdInmate = await InmateService.updateInmateNoID({
					initialId: id,
					...inmate,
					firstName: updateFirstName,
					lastName: updateLastName,
					inmateId: inmate.id,
					location: updateLocation.facility_name
				});
			} else {
				createdInmate = await InmateService.updateInmate({
					initialId: id,
					...inmate,
					firstName: updateFirstName,
					lastName: updateLastName,
					inmateId: inmate.id
				});
			}
			dispatch('update', createdInmate);
		} catch (error) {
			alert(ERROR_MESSAGE_SERVER_COMMUNICATION);
			console.error(error);
			dispatch('error', error);
		}
	};
</script>

{#if $focusedInmate}
	<form id="edit-inmate" on:submit|preventDefault={() => updateInmateRecord($focusedInmate)}>
		<h1>Edit Inmate Record</h1>

		{#if !isInmateNoID($focusedInmate)}
			<label for="inmate-number">
				Inmate ID:
				<input
					type="text"
					name="inmate-number"
					placeholder="Inmate ID"
					disabled
					bind:value={$focusedInmate.id}
				/>
			</label>
		{/if}

		<label for="first-name">
			First Name:
			<input type="text" name="first-name" placeholder="First Name" bind:value={updateFirstName} />
		</label>

		<label for="last-name">
			Last Name:
			<input type="text" name="last-name" placeholder="Last Name" bind:value={updateLastName} />
		</label>

		{#if isInmateNoID($focusedInmate) && updateLocation}
			<label for="facility">
				Facility:
				<FacilitySelect selected={$focusedInmate.location} bind:facility={updateLocation} />
			</label>
		{/if}

		<button disabled={shouldDisableForm()}> Update Inmate Record </button>
	</form>
{/if}

<style lang="scss">
	#edit-inmate {
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
	}

	label {
		width: 100%;
		margin-bottom: 1.5em;
		text-align: left;
		font-weight: 700;
	}

	label:last-of-type {
		margin-bottom: 0.5em;
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

	input[disabled] {
		cursor: not-allowed;
	}

	button {
		width: 100%;
	}
</style>
