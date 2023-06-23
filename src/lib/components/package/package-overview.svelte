<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { FacilityService } from '$services/pbc/facility.service'

  import Book from '$components/book.svelte'
  import Zine from '$components/zine/zine.svelte'
  import FacilitySelect from '$lib/components/facility/select-facility.svelte'
  import type { Recipient } from '$lib/models/pbc/recipient'
  import { isValidFacility, type Facility } from '$models/pbc/facility'
  import { createShipment, shipments } from '$lib/data/shipment.data'
  import { recipient } from '$lib/data/recipient.data'

  const dispatch = createEventDispatcher()

  export let targetRecipient: Recipient

  let removeItems: string[] = []
  let facility: Facility | undefined = $createShipment.facility ?? $recipient.facility

  const loadFacility = async (currentFacility: Facility, recipient: Recipient) => {
    if (!currentFacility && recipient.facility) {
      facility = await FacilityService.resolveFacilityByName(recipient.facility)
      createShipment.setDestination(facility)
    } else if (!facility) {
      if (!$shipments || $shipments.length === 0) {
        facility = undefined
        return
      }
      facility = $shipments[0].facility
      createShipment.setDestination(facility)
    }
  }
  loadFacility(facility, targetRecipient)

  $: isPackageEmpty = () => $createShipment.content.length === 0

  const shouldDisableComplete = (facility?: Facility) => !isValidFacility(facility)
  const shouldDisableRemove = (removeItems: string[]) => !removeItems || removeItems.length === 0

  const addZinesClicked = () => dispatch('add-zines')
  const addBooksClicked = () => dispatch('add-books')

  const completePackage = async () => {
    try {
      createShipment.setRecipient($recipient)
      createShipment.setDestination(facility!)
      const updatedPackage = await createShipment.sync()
      dispatch('update', updatedPackage)
    } catch (error) {
      dispatch('error', error)
      console.error('failed to update Package in database', error)
    }
  }

  $: removeSelected = () => {
    createShipment.removeItemsById(...removeItems)
    removeItems = []
  }
</script>

<section class="package-overview">
  <h1>Package Contents</h1>
  {#if isPackageEmpty()}
    <p>
      <em>There are currently no items in this package</em>
    </p>
  {:else}
    {#key removeItems}
      <ol class="package-items-list">
        {#each $createShipment.content as content}
          <li>
            <label for={content.id?.toString() ?? content.title}>
              <input
                id={content.id?.toString() ?? content.title}
                type="checkbox"
                bind:group={removeItems}
                value={content.id}
              />
              {#if content?.type == 'zine'}
                <Zine zine={content} />
              {/if}

              {#if content?.type == 'book'}
                <Book book={content} />
              {/if}
            </label>
          </li>
        {/each}
        <!-- {#each $createShipment.noISBNBooks as book}
          <li>
            <label for={book.id.toString()}>
              <input
                id={book.id.toString()}
                type="checkbox"
                bind:group={removeItems}
                value={book.id}
              />
              <Book {book} />
            </label>
          </li>
        {/each}
        {#each $createShipment.zines as zine}
          <li>
            <label for={zine.id.toString()}>
              <input
                id={zine.id.toString()}
                type="checkbox"
                bind:group={removeItems}
                value={zine.id}
              />
              <Zine {zine} />
            </label>
          </li>
        {/each} -->
      </ol>
    {/key}
  {/if}

  {#if facility || $createShipment.content.length > 0}
    <div class="package-destination">
      <span class="label">Destination: </span>
      <FacilitySelect
        bind:facility
        selected={facility?.name}
        on:update={({ detail }) => {
          createShipment.setDestination(detail)
        }}
      />
    </div>
  {/if}
  <hr width="100%" />

  {#if isPackageEmpty()}
    <p>
      Add one or more books or zines to start a package for {targetRecipient.firstName}
      {targetRecipient.lastName}
    </p>
  {:else}
    <p>
      Would you like to include additional books or zines? If you're finished,
      {#if !isValidFacility(facility)}
        select a <strong>destination facility</strong>, and then
      {/if}
      click Complete Package.
    </p>
  {/if}

  <nav class="form-options">
    <button on:click={addBooksClicked}>Add Book</button>
    <button on:click={addZinesClicked}>Add Zine(s)</button>
    {#if !isPackageEmpty()}
      <button
        class="danger"
        disabled={shouldDisableRemove(removeItems)}
        on:click={() => removeSelected()}
      >
        Remove Selected
      </button>
    {/if}
    {#if !isPackageEmpty()}
      <button
        class="success"
        disabled={shouldDisableComplete(facility)}
        on:click={() => completePackage()}
      >
        Complete Package
      </button>
    {/if}
  </nav>
</section>

<style lang="scss">
  p {
    max-width: 600px;
  }

  button {
    flex-grow: 1;
  }

  .package-overview {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
    text-align: center;
  }

  .package-items-list {
    text-align: left;
  }

  .package-destination {
    display: flex;
    flex-flow: row nowrap;
    align-items: baseline;
    justify-content: space-between;

    .label {
      font-family: 'Roboto';
      font-weight: 600;
      margin-right: 1em;
    }
  }
</style>
