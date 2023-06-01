<script lang="ts">
  import { gotoPackagesForRecipient } from '$util/routing'
  import type { Facility } from '$models/pbc/facility'
  import FacilitySelect from '$components/facility/select-facility.svelte'
  import { isEmpty } from '$util/strings'
  import { recipient } from '$lib/data/recipient.data.js'
  import { shipments } from '$lib/data/shipment.data.js'
  import { recipientClient } from '$services/bellbooks-backend/recipient.client.js'
  import type { Recipient } from '$models/pbc/recipient.js'
  import { loading } from '$stores/loading.js'

  export let data
  export let { id, firstName, lastName, isRecipientNoId } = data
  let location: Facility

  $: shouldDisableCreateForm = () =>
    isRecipientNoId
      ? isEmpty(firstName) || isEmpty(lastName) || !location
      : isEmpty(firstName) || isEmpty(lastName) || isEmpty(id)

  const createRecipient = async () => {
    loading.start()
    const createdRecipient = await (isRecipientNoId
      ? recipientClient.createRecipient({
          firstName: firstName!,
          lastName: lastName!,
          facility: location!,
        } as Recipient)
      : recipientClient.createRecipient({
          firstName,
          lastName,
          assignedId: id,
        } as Recipient))
    loading.end()

    if (!!createdRecipient && !!createdRecipient.id) {
      recipient.set(createdRecipient)
      shipments.set([])
      gotoPackagesForRecipient(createdRecipient)
    }
  }
</script>

<svelte:head>
  <title>BellBooks - Register Inmate</title>
</svelte:head>

<main class="page">
  <h1>Add New Recipient</h1>

  <form on:submit|preventDefault={createRecipient}>
    <label for="no-id">
      <input type="checkbox" name="no-id" id="no-id" bind:checked={isRecipientNoId} />
      This Recipient does not have an ID
    </label>

    {#if isRecipientNoId}
      <FacilitySelect bind:facility={location} selected={location?.name} />
    {:else}
      <label for="inmateNumber">
        Recipient ID
        <input
          type="text"
          name="inmateNumber"
          id="inmateNumber"
          placeholder="Recipient ID Number"
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

    <button type="submit" class="success" disabled={shouldDisableCreateForm()}> Add Inmate </button>
  </form>
</main>
