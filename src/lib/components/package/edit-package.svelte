<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Book from '$components/book.svelte'
  import Zine from '$components/zine/zine.svelte'
  import { recipient } from '$lib/data/recipient.data'
  import { createShipment } from '$lib/data/shipment.data'

  const dispatch = createEventDispatcher()

  let selectedItems: string[] = []

  const shouldDisableDeleteItems = (selectedItems: string[]) => {
    return !selectedItems || selectedItems.length === 0
  }

  const isEverythingSelected = (selectedItems: string[]) => {
    return !!selectedItems && selectedItems.length === $createShipment.content.length
  }

  const deleteItems = () => {
    if (isEverythingSelected(selectedItems)) return deletePackage()

    try {
      createShipment.removeItemsById(...selectedItems)
      createShipment.sync()
      dispatch('update', $createShipment)
      selectedItems = []
    } catch (error) {
      console.error(`failed to delete items: [${selectedItems.join(', ')}]`, error)
      dispatch('error', error)
    }
  }

  const deletePackage = async () => {
    const shouldDelete = confirm('Are you sure you want to delete this entire package?')
    if (shouldDelete) {
      try {
        createShipment.delete()
        dispatch('delete', {})
      } catch (error) {
        console.error(`failed to delete package with ID "${$createShipment.id}"`, error)
        dispatch('error', error)
      }
    }
  }
  const addItemsClicked = () => dispatch('add-items')
  const logRejectionClicked = () => dispatch('reject')
</script>

<section class="package-overview">
  <h1>
    Edit Package for {$recipient.firstName}
    {$recipient.lastName}
  </h1>
  <p>Select item(s) to edit or delete, or delete the whole package.</p>
  <p>Changes you make to the titles or authors of items will affect the entire database.</p>
  <hr width="100%" />

  <div class="package-contents">
    {#each $createShipment.content as content}
      <label for={content.id.toString()}>
        <input
          type="checkbox"
          name={content.id.toString()}
          id={content.id.toString()}
          bind:group={selectedItems}
          value={content.id}
        />
        {#if content.type == 'book'}
          <Book book={content} />
        {/if}
        {#if content.type == 'zine'}
          <Zine zine={content} />
        {/if}
      </label>
    {/each}
  </div>

  <p>
    <em>
      Completed on <strong><date>{$createShipment.date}</date></strong>
      {#if $createShipment.facility}
        and destined for
        <strong>{$createShipment.facility.facility_name}, {$createShipment.facility.state}</strong>
      {/if}
    </em>
  </p>

  <nav class="form-options">
    <button on:click={addItemsClicked}>Add Items</button>
    <button
      class="danger"
      disabled={shouldDisableDeleteItems(selectedItems)}
      on:click={() => deleteItems()}>Delete Selected Item(s)</button
    >
    <button class="danger" on:click={() => deletePackage()}>Delete Entire Package</button>
  </nav>

  <p class="package-rejected" on:click={logRejectionClicked}>
    {#if $createShipment.alert && $createShipment.alert.id}
      <span class="text-red">
        This package was rejected. Click here to view the attached notes
      </span>
    {:else}
      <span class="text-blue">
        Was this package rejected? Click here to log a package rejection
      </span>
    {/if}
  </p>
</section>

<style lang="scss">
  .package-overview {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
    text-align: center;
  }

  .package-contents {
    width: 100%;
    text-align: left;
  }

  button {
    flex-grow: 1;
  }

  .package-rejected {
    cursor: pointer;
    margin-top: 2em;
  }

  .text-blue {
    color: blue;
    text-decoration: underline;
  }

  .text-red {
    color: rgb(233, 56, 36);
    text-decoration: underline;
  }

  p {
    margin: 0.3em;
  }

  label {
    display: flex;
    align-items: baseline;
    width: 100%;
    margin-bottom: 0.5em;
  }
</style>
