<script lang="ts">
  import { createEventDispatcher } from 'svelte/internal'
  import { isValidFacility } from '$models/pbc/facility'
  import { isEmpty } from '$util/strings'
  import FacilitySelect from '$components/facility/select-facility.svelte'
  import type { Recipient } from '$models/pbc/recipient'
  import { recipient } from '$lib/data/recipient.data'
  import { facilities } from '$stores/facility'
  import { onDestroy } from 'svelte'

  const dispatch = createEventDispatcher()
  const initialState = Object.freeze({ ...recipient.getLatest() })
  let shouldRevert = true

  const shouldDisableForm = ({ assignedId, firstName, lastName, facility }: Recipient) =>
    isEmpty(firstName) ||
    isEmpty(lastName) ||
    (facility === null && isEmpty(assignedId ?? '')) ||
    (!assignedId && !isValidFacility(facility))

  const submit = async () => {
    try {
      const update = await recipient.sync()
      shouldRevert = false
      dispatch('update', update)
    } catch (error) {
      dispatch('error', error)
    }
  }

  const didLoadFacilities = facilities.fetch()

  onDestroy(() => {
    if (shouldRevert) recipient.set({ ...initialState })
  })
</script>

{#if recipient}
  <form id="edit-recipient" on:submit|preventDefault={() => submit()}>
    <h1>Edit Recipient Record</h1>

    {#if !$recipient.facility}
      <label for="recipient-number">
        Recipient ID:
        <input
          type="text"
          name="recipient-number"
          placeholder="Recipient ID"
          bind:value={$recipient.assignedId}
        />
      </label>
    {/if}

    <label for="first-name">
      First Name:
      <input
        type="text"
        id="first-name"
        placeholder="First Name"
        bind:value={$recipient.firstName}
      />
    </label>

    <label for="last-name">
      Last Name:
      <input type="text" id="last-name" placeholder="Last Name" bind:value={$recipient.lastName} />
    </label>

    {#if $recipient.facility}
      {#await didLoadFacilities}
        <label for="facility">
          Facility:
          <FacilitySelect selected={$recipient.facility.name} bind:facility={$recipient.facility} />
        </label>
      {/await}
    {/if}

    <button class="success" disabled={shouldDisableForm($recipient)}>
      Update Recipient Record
    </button>
  </form>
{/if}
