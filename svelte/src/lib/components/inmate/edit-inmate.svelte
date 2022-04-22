<script lang="ts">
  import { createEventDispatcher } from 'svelte/internal'
  import { isInmateNoID, type Inmate } from '$models/pbc/inmate'
  import { isValidFacility, type Facility } from '$models/pbc/facility'
  import { FacilityService } from '$services/pbc/facility.service'
  import { InmateService } from '$services/pbc/inmate.service'
  import { isEmpty } from '$util/strings'
  import FacilitySelect from '$components/facility/select-facility.svelte'

  const dispatch = createEventDispatcher()

  export let inmate: Inmate

  let { firstName, lastName } = inmate
  let location: Facility
  let didLoadFacility = new Promise(() => {})

  const loadFacility = (inmate: Inmate) => {
    didLoadFacility = new Promise(() => {})
    FacilityService.resolveFacilityByName(inmate.location).then((facility) => {
      location = facility
      if (facility) didLoadFacility = Promise.resolve()
    })
  }

  const shouldDisableForm = ({ inmate, firstName, lastName, location }) =>
    isEmpty(firstName) || isEmpty(lastName) || (isInmateNoID(inmate) && !isValidFacility(location))

  const submit = async (inmate: Inmate) => {
    try {
      let createdInmate: Inmate
      if (isInmateNoID(inmate)) {
        createdInmate = await InmateService.updateInmateNoID({
          initialId: inmate.id,
          ...inmate,
          firstName,
          lastName,
          inmateId: inmate.id,
          location: location.facility_name
        })
      } else {
        createdInmate = await InmateService.updateInmate({
          initialId: inmate.id,
          ...inmate,
          firstName,
          lastName,
          inmateId: inmate.id
        })
      }

      dispatch('update', createdInmate)
    } catch (error) {
      dispatch('error', error)
    }
  }

  $: loadFacility(inmate)
</script>

{#if inmate}
  <form id="edit-inmate" on:submit|preventDefault={() => submit(inmate)}>
    <h1>Edit Inmate Record</h1>

    {#if !isInmateNoID(inmate)}
      <label for="inmate-number">
        Inmate ID:
        <input
          type="text"
          name="inmate-number"
          placeholder="Inmate ID"
          disabled
          bind:value={inmate.id}
        />
      </label>
    {/if}

    <label for="first-name">
      First Name:
      <input type="text" id="first-name" placeholder="First Name" bind:value={firstName} />
    </label>

    <label for="last-name">
      Last Name:
      <input type="text" id="last-name" placeholder="Last Name" bind:value={lastName} />
    </label>

    {#await didLoadFacility then}
      <label for="facility">
        Facility:
        <FacilitySelect selected={location.facility_name} bind:facility={location} />
      </label>
    {/await}

    <button
      class="slim success"
      disabled={shouldDisableForm({ inmate, firstName, lastName, location })}
    >
      Update Inmate Record
    </button>
  </form>
{/if}

<style>
  #edit-inmate {
    width: 400px;
    max-width: 80vw;
  }
</style>
