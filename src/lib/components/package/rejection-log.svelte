<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { focusedPackage, focusedPackages } from '$stores/package'
  import { PackageService } from '$services/pbc/package.service'
  import { ShipmentService } from '$services/pbc/shipment.service'
  import { focusedInmate } from '$stores/inmate'

  const dispatch = createEventDispatcher()
  let rejectionContent

  export let packageId = null
  let packageLoaded = !!packageId
    ? focusedPackage.fetch(packageId)
    : Promise.resolve($focusedPackage)

  packageLoaded.then((pbcPackage) => {
    if (pbcPackage.notes.length == 0) {
      focusedPackage.createAlert('')
    } else {
      rejectionContent = pbcPackage.notes[0].content
    }
  })

  const saveAlert = async () => {
    try {
      let note = await ShipmentService.saveNote(rejectionContent)
      focusedPackage.setNote(note)
      let inmate = { id: $focusedInmate.id }
      focusedPackage.setRecipient(inmate)
      focusedPackage.sync()
      dispatch('update', $focusedPackage)
    } catch (error) {
      dispatch('error', error)
      console.error('failed to save rejection log for package', error)
    }
  }

  const removeAlert = async (pbcPackage) => {
    try {
      const packageUpdateData = {
        ...pbcPackage,
        notes: []
      }
      const updatedPackage = await ShipmentService.updatePackage(packageUpdateData)
      focusedPackages.localUpdatePackage(packageUpdateData)
      dispatch('update', updatedPackage)
    } catch (error) {
      dispatch('error', error)
      console.error('failed to save rejection log for package', error)
    }
  }
</script>

{#await packageLoaded then}
  <section class="alert-container">
    <h1>Package Rejection Details</h1>
    {#if $focusedPackage.notes.length > 0}
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
        {#if $focusedPackage.notes.length > 0}
          <button
            type="button"
            class="danger clear-button"
            on:click={() => removeAlert($focusedPackage)}>Clear</button
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
