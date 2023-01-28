<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { isInmateNoID, type Inmate } from '$models/pbc/inmate'
  import editIcon from '$assets/icons/edit.png'
  import Modal from '$components/modal.svelte'
  import EditInmate from '$components/inmate/edit-inmate.svelte'
  import type { Recipient } from '$models/pbc/recipient'
  import type { Shipment } from '$models/pbc/shipment'

  const dispatch = createEventDispatcher()

  export let inmate: Recipient
  export let shouldDisplayModal = false

  const presentModal = () => (shouldDisplayModal = true)
  const closeModal = () => (shouldDisplayModal = false)

  const didReceivePackageLastTwoMonths = ( shipments: Shipment[] ): boolean => {
    if(!shipments || shipments.length === 0) return false
    const MS_TO_DAYS_FACTOR = 1000 * 3600 * 24
    const now = new Date().getTime()
    const mostRecentShipment = new Date(shipments[0].date).getTime()

    return (now - mostRecentShipment) / MS_TO_DAYS_FACTOR < 60
  }

  const onUpdateInmate = (event) => {
    closeModal()
    dispatch('update', event.detail)
  }
  const onUpdateInmateError = (event) => {
    closeModal()
    dispatch('error', event.detail)
  }
</script>

<Modal bind:visible={shouldDisplayModal}>
  <EditInmate {inmate} on:update={onUpdateInmate} on:error={onUpdateInmateError} />
</Modal>


<div id="inmate-name" class:notValid={didReceivePackageLastTwoMonths(inmate.shipments)}>
  <h1 style="margin:10px 10px" aria-label="Inmate's first and last name, and inmate ID if available">
    {inmate.firstName}
    <!-- {inmate.middleInitial ? inmate.middleInitial + '. ' : ''} -->
    {inmate.lastName}
    {#if isInmateNoID(inmate)}
      {#if inmate.facility}
        - <span>{ inmate?.facility?.name }</span>
      {:else}
        - <span>Unknown ID &amp; Facility</span>
      {/if}
    {:else}
      &ensp;<span>ID#{inmate.assignedId}</span>
    {/if}

    <img
      src={editIcon}
      class="icon"
      alt="edit icon; click to edit inmate information"
      on:click={presentModal}
    />
  </h1>
  
</div>

{#if inmate.shipments?.length > 0}
{#if didReceivePackageLastTwoMonths(inmate.shipments)}
<p class="notValid" style="margin-bottom:5px">Recipient received a package <strong>{Math.floor(((new Date()).getTime()- ((new Date(inmate.shipments[0].date)).getTime()))/(1000*3600*24))} days ago</strong>, on <strong>{inmate.shipments[0].date}</strong></p>
{/if}
{/if}

<style lang="scss">
  #inmate-name {
    display: flex;
    flex-flow: row wrap;
    align-self: center;

    justify-content: space-between;
    align-items: center;
  }
.notValid{
  background-color: lightpink;
  border-radius: 20px;
  padding: 10px;
}
    span {
      color: darkslategray;
      font-weight: 700;
      font-size: 1.75rem;
    }
  
</style>
