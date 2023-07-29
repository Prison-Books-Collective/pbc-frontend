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
  let numberOfShipments

  onMount( async () => {
    focusOnLoadElement.focus()
    //numberOfShipments = length of list of shipments from Backend
    let shipments = await ShipmentService.getShipmentsByDate(new Date().toISOString().split("T")[0])
    numberOfShipments = shipments.length
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
  <p>
    Number of shipments made today: {numberOfShipments}
  </p>
</main>

<style>
  button {
    align-self: center;
  }
</style>
