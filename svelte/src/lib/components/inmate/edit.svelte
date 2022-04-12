<script lang="ts">
	import { createEventDispatcher } from 'svelte/internal';
	import { InmateService, isInmateNoID } from '$services/pbc/inmate.service';
	import { FacilityService } from '$services/pbc/facility.service';
	import FacilitySelect from '$components/facility/select.svelte';
	import { ERROR_MESSAGE_SERVER_COMMUNICATION } from '$util/error';
	import { focusedInmate } from '$stores/inmate';

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
	label:last-of-type {
		margin-bottom: 0.5em;
	}

	button {
		width: 100%;
	}
</style>
