<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import editIcon from '$assets/icons/edit.png'
  import Modal from '$components/modal.svelte'
  import EditRecipient from '$components/recipient/edit-recipient.svelte'
  import { isRecipientNoId, type Recipient } from '$models/pbc/recipient'
  import type { Shipment } from '$models/pbc/shipment'

  const dispatch = createEventDispatcher()

  export let recipient: Recipient
  export let shipments: Shipment[]
  export let shouldDisplayModal = false

  const presentModal = () => (shouldDisplayModal = true)
  const closeModal = () => (shouldDisplayModal = false)

  $: didReceivePackageLastTwoMonths = (): boolean => {
    if (!shipments || shipments.length === 0) return false
    const MS_TO_DAYS_FACTOR = 1000 * 3600 * 24
    const now = new Date().getTime()
    const mostRecentShipment = new Date(shipments[0].date).getTime()

    return (now - mostRecentShipment) / MS_TO_DAYS_FACTOR < 60
  }

  const onUpdateRecipient = (event: { detail: any }) => {
    closeModal()
    dispatch('update', event.detail)
  }
  const onUpdateRecipientError = (event: { detail: any }) => {
    closeModal()
    dispatch('error', event.detail)
  }
</script>

<Modal bind:visible={shouldDisplayModal}>
  <EditRecipient on:update={onUpdateRecipient} on:error={onUpdateRecipientError} />
</Modal>

<div id="recipient-name" class:notValid={shipments?.length > 0 && didReceivePackageLastTwoMonths()}>
  <h1
    style="margin:10px 10px"
    aria-label="Recipient's first and last name, and OPUS ID if available"
  >
    {recipient.firstName}
    {recipient.lastName}
    {#if isRecipientNoId(recipient)}
      {#if recipient.facility}
        - <span>{recipient?.facility?.name}</span>
      {:else}
        - <span>Unknown ID &amp; Facility</span>
      {/if}
    {:else}
      &ensp;<span>ID#{recipient.assignedId}</span>
    {/if}

    <img
      src={editIcon}
      class="icon"
      alt="edit icon; click to edit recipient information"
      on:click={presentModal}
    />
  </h1>
</div>

{#if shipments?.length > 0 && didReceivePackageLastTwoMonths()}
  <p class="notValid" style="margin-bottom:5px">
    Recipient received a package <strong
      >{Math.floor(
        (new Date().getTime() - new Date(shipments[0].date).getTime()) / (1000 * 3600 * 24),
      )} days ago</strong
    >, on <strong>{shipments[0].date}</strong>
  </p>
{/if}

<style lang="scss">
  #recipient-name {
    display: flex;
    flex-flow: row wrap;
    align-self: center;

    justify-content: space-between;
    align-items: center;
  }
  .notValid {
    background-color: lightpink;
    border-radius: 3px;
    padding: 10px;
  }
  span {
    color: var(--color-text-subtitle);
    font-weight: 700;
    font-size: 1.75rem;
  }
</style>
