<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { PackageService } from '$services/pbc/package.service'
  import { focusedPackage } from '$stores/package'
  import Book from '$components/book.svelte'
  import Zine from '$components/zine/zine.svelte'

  const dispatch = createEventDispatcher()

  let selectedItems = []

  $: shouldDisableSelectionOptions = () => {
    return !selectedItems || selectedItems.length === 0
  }

  const deleteItems = () => {
    try {
      focusedPackage.removeItemsById(...selectedItems)
      const updatedPackage = PackageService.updatePackage($focusedPackage)
      dispatch('update', updatedPackage)
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
        await PackageService.deletePackage($focusedPackage.id)
        dispatch('delete', {})
      } catch (error) {
        console.error(`failed to delete package with ID "${$focusedPackage.id}"`, error)
        dispatch('error', error)
      }
    }
  }
  const addItemsClicked = () => dispatch('add-items')
  const logRejectionClicked = () => dispatch('reject')
</script>

<section class="package-overview">
  <h1>
    Edit Package for {$focusedPackage.inmate?.firstName || $focusedPackage.inmateNoId?.firstName}
    {$focusedPackage.inmate?.lastName || $focusedPackage.inmateNoId?.lastName}
  </h1>
  <p>Select item(s) to edit or delete, or delete the whole package.</p>
  <p>Changes you make to the titles or authors of items will affect the entire database.</p>
  <hr width="100%" />

  <div class="package-contents">
    {#each $focusedPackage.books as book}
      <label for={book.id.toString()} class="checkbox">
        <input
          type="checkbox"
          name={book.id.toString()}
          id={book.id.toString()}
          bind:group={selectedItems}
          value={book.id}
        />
        <Book {book} />
      </label>
    {/each}
    {#each $focusedPackage.noISBNBooks as book}
      <label for={book.id.toString()} class="checkbox">
        <input
          type="checkbox"
          name={book.id.toString()}
          id={book.id.toString()}
          bind:group={selectedItems}
          value={book.id}
        />
        <Book {book} />
      </label>
    {/each}
    {#each $focusedPackage.zines as zine}
      <label for={zine.id.toString()} class="checkbox">
        <input
          type="checkbox"
          name={zine.id.toString()}
          id={zine.id.toString()}
          bind:group={selectedItems}
          value={zine.id}
        />
        <Zine {zine} />
      </label>
    {/each}
  </div>

  <p>
    <em>
      Completed on <strong><date>{$focusedPackage.date}</date></strong>
      {#if $focusedPackage.facility}
        and destined for
        <strong>{$focusedPackage.facility.facility_name}, {$focusedPackage.facility.state}</strong>
      {/if}
    </em>
  </p>

  <nav class="form-options">
    <button on:click={addItemsClicked}>Add Items</button>
    <button class="danger" disabled={shouldDisableSelectionOptions()} on:click={() => deleteItems()}
      >Delete Selected Item(s)</button
    >
    <button class="danger" on:click={() => deletePackage()}>Delete Entire Package</button>
  </nav>

  <p class="package-rejected" on:click={logRejectionClicked}>
    {#if $focusedPackage.alert && $focusedPackage.alert.id}
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
