<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { focusedPackage, focusedPackages } from '$stores/package'
  import { FacilityService } from '$services/pbc/facility.service'

  import Book from '$components/book.svelte'
  import Zine from '$components/zine/zine.svelte'
  import FacilitySelect from '$lib/components/facility/select-facility.svelte'
  import type { Inmate, InmateNoID } from '$lib/models/pbc/inmate'

  const dispatch = createEventDispatcher()

  export let inmate: Inmate

  let removeItems = []
  let facility = $focusedPackage.facility
  ;(async () => {
    if (!facility && inmate.location) {
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
  })()

  $: isPackageEmpty = () =>
    $focusedPackage.books.length === 0 &&
    $focusedPackage.noISBNBooks.length === 0 &&
    $focusedPackage.zines.length === 0

  $: shouldDisableComplete = () => !facility
  $: shouldDisableRemove = () => !removeItems || removeItems.length === 0

  const addZinesClicked = () => dispatch('add-zines')
  const addBooksClicked = () => dispatch('add-books')
  $: completePackageClicked = async () => {
    try {
      focusedPackage.setInmate(inmate)
      const updatedPackage = await focusedPackage.sync($focusedPackage)
      dispatch('update', updatedPackage)
    } catch (error) {
      dispatch('error', error)
      console.error('failed to update Package in database', error)
    }
  }
  const removeSelectedClicked = () => {
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
    <ol class="package-items-list">
      {#each $focusedPackage.books as book}
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
      {#each $focusedPackage.noISBNBooks as book}
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
      {/each}
    </ol>
  {/if}

  {#if facility || $focusedPackage.books.length > 0 || $focusedPackage.noISBNBooks.length > 0 || $focusedPackage.zines.length > 0}
    <div class="package-destination">
      <span class="label">Destination: </span>
      <FacilitySelect
        bind:facility
        selected={facility?.facility_name}
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
      {#if !facility}
        select a <strong>destination facility</strong>, and then
      {/if}
      click Complete Package.
    </p>
  {/if}

  <nav class="package-options">
    <button on:click={addBooksClicked}>Add Book</button>
    <button on:click={addZinesClicked}>Add Zine(s)</button>
    {#if !isPackageEmpty()}
      <button on:click={removeSelectedClicked} class="danger" disabled={shouldDisableRemove()}>
        Remove Selected
      </button>
    {/if}
    {#if !isPackageEmpty()}
      <button on:click={completePackageClicked} class="success" disabled={shouldDisableComplete()}>
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

  .package-options {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    align-items: center;
  }
</style>
