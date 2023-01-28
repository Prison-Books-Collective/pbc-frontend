<script lang="ts">
  import { gotoPackagesForInmate } from '$util/routing'
  import { focusedInmate } from '$stores/inmate'
  import type { Facility } from '$models/pbc/facility'
  import { InmateService } from '$services/pbc/inmate.service'
  import FacilitySelect from '$components/facility/select-facility.svelte'
  import { isEmpty } from '$util/strings'
  import { RecipientService } from '$services/pbc/recipient.service'
  import { focusedPackages } from '$stores/package'

  export let data
  export let { id, firstName, lastName, isInmateNoID } = data
  export let location: Facility = null

  const shouldDisableCreateInmate = ({ isInmateNoID, firstName, lastName, location, id }) =>
    isInmateNoID
      ? isEmpty(firstName) || isEmpty(lastName)
      : isEmpty(firstName) || isEmpty(lastName) || isEmpty(id)

  const createInmate = async () => {
    const createdInmate = await (isInmateNoID
      ? RecipientService.createRecipient({ firstName, lastName, assignedId: null, facility: location })
      : RecipientService.createRecipient({ firstName, lastName, assignedId: id }))

    if (!!createdInmate && !!createdInmate.id) {
      focusedInmate.set(createdInmate)
      focusedPackages.set([])
      gotoPackagesForInmate(createdInmate)
    }
  }
</script>

<svelte:head>
  <title>BellBooks - Register Inmate</title>
</svelte:head>

<main class="page">
  <h1>Add New Recipient</h1>

  <form autocomplete="off" on:submit|preventDefault={createInmate}>
    <label for="no-id" class="checkbox">
      <input type="checkbox" name="no-id" id="no-id" bind:checked={isInmateNoID} />
      This Recipient does not have an ID
    </label>

    {#if isInmateNoID}
      <FacilitySelect bind:facility={location} selected={location?.facility_name} />
    {:else}
      <label for="inmateNumber">
        Recipient ID
        <input
          type="text"
          name="inmateNumber"
          id="inmateNumber"
          placeholder="Recipient ID Number"
          bind:value={data.id}
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
      class="success"
      disabled={shouldDisableCreateInmate({ isInmateNoID, firstName, lastName, id, location })}
    >
      Add Inmate
    </button>
  </form>
</main>
