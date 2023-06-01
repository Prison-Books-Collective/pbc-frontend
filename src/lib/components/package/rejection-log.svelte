<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { ShipmentService } from '$services/pbc/shipment.service'
  import { createShipment, shipments } from '$lib/data/shipment.data'
  import { recipient } from '$lib/data/recipient.data'
  import { shipmentClient } from '$services/bellbooks-backend/shipment.client'

  const dispatch = createEventDispatcher()
  let rejectionContent: string

  export let shipmentId = null
  let shipmentLoaded = shipmentId
    ? createShipment.fetch(shipmentId)
    : Promise.resolve($createShipment)

  shipmentLoaded.then((pbcPackage) => {
    if (pbcPackage.notes.length == 0) {
      createShipment.setAlert('')
    } else {
      rejectionContent = pbcPackage.notes[0].content
    }
  })

  const saveAlert = async () => {
    try {
      let note = await ShipmentService.saveNote(rejectionContent)
      createShipment.setNote(note)
      createShipment.setRecipient($recipient)
      createShipment.sync()
      dispatch('update', $createShipment)
    } catch (error) {
      dispatch('error', error)
      console.error('failed to save rejection log for package', error)
    }
  }

  const removeAlert = async (pbcPackage) => {
    try {
      const shipmentUpdateData = {
        ...pbcPackage,
        notes: [],
      }
      const updatedShipment = await shipmentClient.updateShipment(shipmentUpdateData)
      shipments.localUpdateShipment(shipmentUpdateData)
      dispatch('update', updatedShipment)
    } catch (error) {
      dispatch('error', error)
      console.error('failed to save rejection log for package', error)
    }
  }
</script>

{#await shipmentLoaded then}
  <section class="alert-container">
    <h1>Package Rejection Details</h1>
    {#if $createShipment.notes.length > 0}
      <p>This package was rejected. You can update the rejection notes below:</p>
    {:else}
      <p>Enter details about the rejection to log below:</p>
    {/if}
    <form on:submit|preventDefault={() => saveAlert()}>
      <textarea
        name="package-rejection"
        placeholder="Reason the package was rejected"
        rows="10"
        bind:value={rejectionContent}
      />

      <div class="form-options">
        <button class="log-button" disabled={!rejectionContent || rejectionContent === ''}
          >Log Rejection for Package</button
        >
        {#if $createShipment.notes.length > 0}
          <button
            type="button"
            class="danger clear-button"
            on:click={() => removeAlert($createShipment)}>Clear</button
          >
        {/if}
      </div>
    </form>
  </section>
{/await}

<style lang="scss">
  .alert-container {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
    text-align: center;
    height: fit-content;
  }

  .log-button {
    flex: 3;
  }

  .clear-button {
    flex: 1;
  }

  textarea {
    padding: 0.5em;
    font-size: 1rem;
    background: none;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 3px;
    resize: none;
  }
</style>
