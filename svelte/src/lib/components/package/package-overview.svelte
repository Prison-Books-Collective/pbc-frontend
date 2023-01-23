<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { focusedPackage, focusedPackages } from '$stores/package'
  import { FacilityService } from '$services/pbc/facility.service'

  import Book from '$components/book.svelte'
  import Zine from '$components/zine/zine.svelte'
  import FacilitySelect from '$lib/components/facility/select-facility.svelte'
  import type { Recipient } from '$lib/models/pbc/recipient'
  import { isValidFacility } from '$models/pbc/facility'
    import { focusedInmate } from '$stores/inmate'

  const dispatch = createEventDispatcher()

  export let inmate: Recipient

  let removeItems = []
  let facility = $focusedPackage.facility

  const loadFacility = async (currentFacility, inmate) => {
    if (!currentFacility && inmate.location) {
      facility = await FacilityService.resolveFacilityByName(inmate.location)
      focusedPackage.setDestination(facility)
    } else if (!facility) {
      if (!$focusedPackages || $focusedPackages.length === 0) {
        facility = null
        return
      }
      facility = $focusedPackages[0].facility
      focusedPackage.setDestination(facility)
    }
  }
  loadFacility(facility, inmate)

  $: isPackageEmpty = () =>
    $focusedPackage.content.length === 0

  const shouldDisableComplete = (facility) => !isValidFacility(facility)
  const shouldDisableRemove = (removeItems) =>  true //!removeItems || removeItems.length === 0

  const addZinesClicked = () => dispatch('add-zines')
  const addBooksClicked = () => dispatch('add-books')

  const completePackage = async (inmate) => {
    try {
      
      inmate = {id: $focusedInmate.id}
      focusedPackage.setRecipient(inmate)
      let currPackage = await focusedPackage.get()
      if (!currPackage["id"]){
      delete currPackage["id"]
    }
    currPackage["facility"] = facility

      focusedPackage.set(currPackage)
      const updatedPackage = await focusedPackage.sync()
      dispatch('update', updatedPackage)
    } catch (error) {
      dispatch('error', error)
      console.error('failed to update Package in database', error)
    }
  }

  $: removeSelected = () => {
    focusedPackage.removeItemsById(...removeItems)
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
        {#each $focusedPackage.content as content}
          <li>
            <label for={content.id.toString()} class="checkbox">
              <input
                id={content.id.toString()}
                type="checkbox"
                bind:group={removeItems}
                value={content.id}
              />
              {#if content.creators != null}
              <Book book={content} />
              {/if}
              {#if content.code != null}
              <Zine zine={content}/>
              {/if}
            </label>
          </li>
        {/each}
        <!-- {#each $focusedPackage.noISBNBooks as book}
          <li>
            <label for={book.id.toString()} class="checkbox">
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
        {#each $focusedPackage.zines as zine}
          <li>
            <label for={zine.id.toString()} class="checkbox">
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

  {#if facility || $focusedPackage.content.length > 0}
    <div class="package-destination">
      <span class="label">Destination: </span>
      <FacilitySelect
        bind:facility
        selected={facility?.name}
        on:update={({ detail }) => {
          focusedPackage.setDestination(detail)
        }}
      />
    </div>
  {/if}
  <hr width="100%" />

  {#if isPackageEmpty()}
    <p>
      Add one or more books or zines to start a package for {inmate.firstName}
      {inmate.lastName}
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
        on:click={() => completePackage(inmate)}
      >
        Complete Package
      </button>
    {/if}
  </nav>
</section>

<style lang="scss">
  h1 {
    text-decoration: underline;
    font-weight: normal;
  }

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
      font-family: Roboto;
      font-weight: 600;
      margin-right: 1em;
    }
  }
</style>
