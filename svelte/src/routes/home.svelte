<script lang="ts" context="module">
  export enum VALID_SEARCHES {
    ID = 'id',
    NAME_AND_LOCATION = 'name_and_location',
  }
</script>

<script lang="ts">
  import { goto } from '$app/navigation'
  import { FacilityService } from '$lib/services/pbc-service/facility.service'
  import { PackageService } from '$lib/services/pbc-service/package.service'
  import { InmateService } from '$lib/services/pbc-service/inmate.service'
  import { formatDate } from '$lib/util/time'
  import { ROUTE_OVERVIEW, ROUTE_INMATE_CREATE, ROUTE_INMATE_DISAMBIGUATION } from '$lib/util/routing'

  let inmateSearch = {
    id: null,
    firstName: null,
    lastName: null,
    location: null,
  }

  let searchBy = VALID_SEARCHES.ID
  $: searchText = searchBy === VALID_SEARCHES.ID 
    ? 'Search by Name if no ID is available'
    : 'Search by Inmate ID'

  const toggleSearch = () => {
    if( searchBy === VALID_SEARCHES.ID ) {
      searchBy = VALID_SEARCHES.NAME_AND_LOCATION
    } else {
      searchBy = VALID_SEARCHES.ID
    }
  }

  const today = formatDate( new Date() )
  let getFacilities = FacilityService.getAllFacilities()
  let getPackageCount = PackageService.getPackageCount( today )

  const searchForInmate = async () => {
    if( searchBy === VALID_SEARCHES.ID ) {
      if( inmateSearch.id === null ) { return }
      try {
        const foundInmate = await InmateService.getInmate(inmateSearch.id)
        if( foundInmate === null ) {
          alert( `Failed to find an inmate with ID "${ inmateSearch.id }"` )
          return
        }
        goto( ROUTE_OVERVIEW( inmateSearch.id ))
        return
      } catch( error ) {
        alert( `Communication with server failed. Check that the server is running and not in a failing state.` )
        console.error( error )
        return
      }
    } else if( searchBy === VALID_SEARCHES.NAME_AND_LOCATION ) {
      try {
        const foundInmates = await InmateService.getInmateNoIdByName({
          firstName: inmateSearch.firstName,
          lastName: inmateSearch.lastName
        })
        if( foundInmates === null || foundInmates.length === 0 ) {
          const shouldCreateNewInmate = confirm( `Failed to find any inmates named "${ inmateSearch.firstName } ${ inmateSearch.lastName }". To create a new inmate, click OK` )
          if( shouldCreateNewInmate ) {
            goto( ROUTE_INMATE_CREATE({ firstName: inmateSearch.firstName, lastName: inmateSearch.lastName }) )
            return
          }
          return
        }

        if( foundInmates.length > 1 ) {
          goto( ROUTE_INMATE_DISAMBIGUATION({ firstName: inmateSearch.firstName, lastName: inmateSearch.lastName }) )
        }

        if( foundInmates.length === 1 ) {
          const foundInmate = foundInmates[ 0 ]
          goto( ROUTE_OVERVIEW( foundInmate.id ))
        }
      } catch( error ) {
        alert( `Communication with server failed. Check that the server is running and not in a failing state.` )
        console.error( error )
        return
      }
      
    }
  }
</script>


<svelte:head>
  <title>BellBooks</title>
</svelte:head>

<main>

  <form on:submit|preventDefault={searchForInmate}>
    {#if searchBy === VALID_SEARCHES.ID}
      <input 
        id="inmateId" 
        type="text"
        placeholder="Enter Inmate ID #, press Enter"
        name="inmateNumber"
        bind:value={inmateSearch.id}>
    {:else if searchBy === VALID_SEARCHES.NAME_AND_LOCATION}
      <input 
        id="inmateFirstName"
        type="text" 
        name="inmateFirstName" 
        placeholder="First Name"
        bind:value={inmateSearch.firstName}>

      <input 
        id="inmateLastName"
        type="text" 
        name="inmateLastName" 
        placeholder="Last Name"
        bind:value={inmateSearch.lastName}>

      {#if false}
      <select bind:value={inmateSearch.location} on:change={newValue => console.log(inmateSearch.location)}>
        {#await getFacilities}
          <option>Loading Facilities</option>
        {:then facilities}
          <option disabled selected value={null}>Select Facility</option>
          {#each facilities as facility}
            <option value={facility}>{ facility.facility_name }</option>
          {/each}
        {/await}
      </select>
      {/if}

      <button type="submit" disabled={!(inmateSearch.firstName) || !(inmateSearch.lastName)}>
        Search
      </button>
    {/if}
  </form>

  <p id="toggleSearch" on:click={toggleSearch}>
    { searchText }
  </p>

  {#await getPackageCount then packageCount}
  <p>
    You have completed <span id="packageCount">{ packageCount }</span> packages on <date>{ today }</date>
  </p>
  {/await}
</main>

<style lang="scss">
  form {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    input[type=text] {
      background-color: transparent;
      border: none;
      font-size: 1.5rem;
      text-align: center;
      max-width: 100vw;
      width: calc(100vw - 5rem);
      margin-bottom: 1rem;
    }

    select {
      appearance: none;

      -moz-appearance: none;
      border-radius: 3px;
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
      padding: 0.5rem;

      background-color: transparent;
      border: none;
      font-size: 1.5rem;
      text-align-last: center;
      -moz-text-align-last: center;
      -ms-text-align-last: center;
      margin-bottom: 1rem;

      option {
        text-align: center;
      }
    }

    button {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: space-between;

      &:disabled {
        cursor: not-allowed;
      }
    }
  }

  #toggleSearch {
    color: blue;
    text-decoration: underline;
    font-size: 1rem;
  }

  #packageCount {
    font-weight: 700;
  }
</style>