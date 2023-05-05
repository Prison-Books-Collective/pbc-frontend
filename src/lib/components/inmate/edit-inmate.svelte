<script lang="ts">
  import { createEventDispatcher } from 'svelte/internal'
  import { isInmateNoID, type Inmate } from '$models/pbc/inmate'
  import { isValidFacility, type Facility } from '$models/pbc/facility'
  import { FacilityService } from '$services/pbc/facility.service'
  import { InmateService } from '$services/pbc/inmate.service'
  import { isEmpty } from '$util/strings'
  import FacilitySelect from '$components/facility/select-facility.svelte'
  import { isRecipientNoId, type Recipient } from '$models/pbc/recipient'
  import { RecipientService } from '$services/pbc/recipient.service'
  import { updated } from '$app/stores'
  import { goto } from '$app/navigation'
  import { HomepageSearch, ROUTE_HOME } from '$util/routing'

  const dispatch = createEventDispatcher()

  export let recipient: Recipient

  let { firstName, lastName, assignedId } = recipient
  let location: Facility
  let didLoadFacility = new Promise(() => {})

  const loadFacility = (recipient: Recipient) => {
    didLoadFacility = new Promise(() => {})
    FacilityService.resolveFacilityByName(recipient.facility).then((facility) => {
      location = facility
      if (facility) didLoadFacility = Promise.resolve()
    })
  }

  const shouldDisableForm = ({ recipient, assignedId, firstName, lastName, location }) =>
    isEmpty(firstName) ||
    isEmpty(lastName) ||
    isEmpty(assignedId) ||
    (isRecipientNoId(recipient) && !isValidFacility(location))

  const submit = async (recipient: Recipient) => {
    try {
      let updatedRecipient: Recipient

      updatedRecipient = await RecipientService.updateRecipient({
        id: recipient.id,
        ...recipient,
        firstName,
        lastName,
        assignedId: assignedId
      })

      dispatch('update', updatedRecipient)
    } catch (error) {
      dispatch('error', error)
    }
  }

  $: loadFacility(recipient)
</script>

{#if recipient}
  <form id="edit-inmate" on:submit|preventDefault={() => submit(recipient)}>
    <h1>Edit Recipient Record</h1>

    {#if !isRecipientNoId(recipient)}
      <label for="recipient-number">
        Recipient ID:
        <input
          type="text"
          name="recipient-number"
          placeholder="Recipient ID"
          bind:value={assignedId}
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
      class="success"
      disabled={shouldDisableForm({ recipient, assignedId, firstName, lastName, location })}
    >
      Update Recipient Record
    </button>
  </form>
{/if}

<style>
  #edit-inmate {
    width: 400px;
    max-width: 80vw;
  }
</style>
