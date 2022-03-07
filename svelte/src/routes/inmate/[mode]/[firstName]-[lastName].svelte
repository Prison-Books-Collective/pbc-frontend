<script lang="ts" context="module">
  export enum INMATE_SEARCH_MODE { 
    CREATE = 'create', 
    DISAMBIGUATION = 'disambiguation'
  }

  export function load({ params }) {
    const { mode, firstName, lastName } = params
    return { props: { mode, firstName, lastName }}
  }
</script>

<script lang="ts">
  import { goto } from '$app/navigation'
  import { InmateService } from '$lib/services/pbc-service'
  import { FacilityService } from '$lib/services/pbc-service/facility.service'
  import { ROUTE_OVERVIEW } from '$lib/util/routing'
  
  export let mode: INMATE_SEARCH_MODE
  export let firstName: string, lastName: string
  export let location

  let getInmates = mode === INMATE_SEARCH_MODE.DISAMBIGUATION
    ? InmateService.getInmateNoIdByName({ firstName, lastName })
    : Promise.resolve([])
  
  let getFacilities = mode === INMATE_SEARCH_MODE.CREATE
    ? FacilityService.getAllFacilities()
    : Promise.resolve([])

  const createInmate = async () => {
    const createdInmate = await InmateService.createInmateNoID({
      firstName, 
      lastName, 
      location
    })

    goto(ROUTE_OVERVIEW( createdInmate.id ))
  }
</script>

<main>
  {#if mode === INMATE_SEARCH_MODE.CREATE}
    <h1>Add New Inmate</h1>

    <form on:submit|preventDefault={createInmate}>
      <input 
        type="text" 
        name="firstName" 
        id="firstName"
        placeholder="First Name"
        bind:value={firstName}>
      <input 
        type="text" 
        name="lastName" 
        id="lastName"
        placeholder="Last Name"
        bind:value={lastName}>
      <select bind:value={location}>
        {#await getFacilities}
          <option value={undefined}>Loading Facilities</option>
        {:then facilities}
          <option disabled selected value={null}>Select Facility</option>
          {#each facilities as facility}
            <option value={facility}>{ facility.facility_name }</option>
          {/each}
        {/await}
      </select>

      <button type="submit" disabled={!(firstName) || !(lastName) || !(location)}>
        Add Inmate
      </button>
    </form>


  {:else if mode === INMATE_SEARCH_MODE.DISAMBIGUATION}
    <h1>Inmate Selection</h1>
    <p>Multiple inmates with this name were found, please select which inmate you're creating a package for:</p>

    {#await getInmates}
      <p>Loading...</p>
    {:then inmates}
      <nav role="inmate selection">
        {#each inmates as inmate}
          <p>
            <a href={ROUTE_OVERVIEW( inmate.id )}>
              <strong>{ inmate.location }</strong> - 
              { inmate.firstName } { inmate.middleInitial ? inmate.middleInitial + '. ' : '' }{ inmate.lastName }
            </a>
          </p>
        {/each}
      </nav>
    {/await}
  {/if}
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
</style>