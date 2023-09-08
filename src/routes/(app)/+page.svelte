<script lang="ts">
  import { onMount } from 'svelte'
  import { gotoRecipientSearch } from '$util/routing'
  import { isEmpty } from '$util/strings'
  import { HomepageSearch } from '$util/routing'
  import { ShipmentService } from '$services/pbc/shipment.service'

  export let data

  // export let mode: HomepageSearch = data?.props?.mode || HomepageSearch.ID
  //let mode : HomepageSearch = data?.props?.mode || HomepageSearch.ID
  let mode = HomepageSearch.ID
  let focusOnLoadElement: HTMLInputElement

  let inmateID = ''
  let firstName = ''
  let lastName = ''

  /* todo (cocowmn):  we should create a new endpoint in the backend to get just the count of packages for a given date so that we are not overfetching data on a limited cellular plan */
  let todaysShipmentsPromise = ShipmentService.getShipmentsByDate(
    new Date().toISOString().split('T')[0],
  )

  onMount(async () => {
    focusOnLoadElement.focus()
  })

  const shouldDisableSearch = (firstName: string, lastName: string) =>
    isEmpty(firstName) && isEmpty(lastName)
  const toggleSearch = () => {
    if (mode == HomepageSearch.ID) {
      mode = HomepageSearch.NAME
    } else {
      mode = HomepageSearch.ID
    }
  }

  $: searchText = mode === HomepageSearch.ID ? 'Search by Name?' : 'Search by Recipient ID?'
</script>

<svelte:head>
  <title>BellBooks - Search</title>
</svelte:head>

<main class="page">
  <form
    autocomplete="off"
    on:submit|preventDefault={() =>
      gotoRecipientSearch(mode, { id: inmateID, firstName, lastName })}
  >
    {#if mode === HomepageSearch.ID}
      <input
        id="inmate-id"
        type="text"
        placeholder="Enter Recipient ID #, press Enter"
        name="inmateNumber"
        class="big"
        bind:value={inmateID}
        bind:this={focusOnLoadElement}
      />
    {:else if mode === HomepageSearch.NAME}
      <input
        id="inmateFirstName"
        type="text"
        name="inmateFirstName"
        placeholder="First Name"
        class="big"
        bind:value={firstName}
        bind:this={focusOnLoadElement}
      />

      <input
        id="inmateLastName"
        type="text"
        name="inmateLastName"
        placeholder="Last Name"
        class="big"
        bind:value={lastName}
      />

      <button type="submit" disabled={shouldDisableSearch(firstName, lastName)}>
        Find Recipient(s)
      </button>
    {/if}
  </form>

  <p class="link" on:click={() => toggleSearch()}>
    {searchText}
  </p>

  <!-- <DailyPackages /> -->
  {#await todaysShipmentsPromise then todaysShipments}
    <p>
      Number of shipments made today: {todaysShipments.length}
    </p>
  {/await}
</main>

<style>
  button {
    align-self: center;
  }
</style>
