<script lang="ts">
  import { createEventDispatcher } from 'svelte/internal';
  import { InmateService, isInmateNoID } from '$lib/services/pbc-service/inmate.service'
  import { FacilityService } from '$lib/services/pbc-service/facility.service'
  import FacilitySelect from '$lib/components/facility/select.svelte'
  import type { Inmate, InmateNoID } from '$lib/services/pbc-service';
  import { ERROR_MESSAGE_SERVER_COMMUNICATION } from '$lib/util/error';

  const dispatch = createEventDispatcher()
  export let id: string

  let inmate: Inmate | InmateNoID
  let location

  const isDisabled = (inmate) => {
    return (
      !inmate.firstName 
      || inmate.firstName === ''
      || !inmate.lastName
      || inmate.lastName === ''
      || isInmateNoID(inmate) && !(inmate.location)
      )
  }

  const updateInmateRecord = async (inmate) => {
    try {
      let createdInmate
      if(isInmateNoID(inmate)) {
        createdInmate = await InmateService.updateInmateNoID({
          initialId: id,
          ...inmate,
          inmateId: inmate.id,
          location: location.facility_name,
        })
      } else {
        createdInmate = await InmateService.updateInmate({
          initialId: id,
          ...inmate,
          inmateId: inmate.id,
        })
      }
      dispatch('update', createdInmate)
    } catch(error) {
      alert(ERROR_MESSAGE_SERVER_COMMUNICATION)
      console.error(error)
      dispatch('error', error)
    }
  }

  ;(async () => {
    inmate = await InmateService.getInmateUnknownIdStatus(id)
    location = await FacilityService.resolveFacilityByName(inmate.location)
  })()
</script>

{#if inmate}
<form id="edit-inmate" on:submit|preventDefault={() => updateInmateRecord(inmate)}>
  <h1>
    Edit Inmate Record
  </h1>

  {#if !isInmateNoID(inmate)}
  <label for="inmate-number">
    Inmate ID: 
    <input 
      type="text" 
      name="inmate-number" 
      placeholder="Inmate ID"
      disabled
      bind:value={inmate.id}>
  </label>
  {/if}
  
  <label for="first-name">
    First Name: 
    <input 
      type="text" 
      name="first-name" 
      placeholder="First Name"
      bind:value={inmate.firstName}>
  </label>
  
  <label for="last-name">
    Last Name: 
    <input 
      type="text" 
      name="last-name" 
      placeholder="Last Name"
      bind:value={inmate.lastName}>
  </label>

  {#if isInmateNoID(inmate) && location}
  <label for="facility">
    Facility: 
    <FacilitySelect selected={inmate.location} bind:facility={location} on:update={() => inmate.location = location.facility_name}></FacilitySelect>
  </label>
  {/if}

  <button disabled={isDisabled(inmate)}>
    Update Inmate Record
  </button>
</form>
{/if}


<style lang="scss">
  #edit-inmate {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }

  label {
    width: 100%;
  }

  input[type=text] {
    padding: 0.5em;
    width: 95%;
    max-width: auto;
    font-size: 1rem;
    background: none;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 3px;
  }

  input[disabled] {
    cursor: not-allowed;
  }

  button {
    width: 100%;
  }

</style>