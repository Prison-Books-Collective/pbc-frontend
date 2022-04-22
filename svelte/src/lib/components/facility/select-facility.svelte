<script lang="ts">
  import { createEventDispatcher } from 'svelte/internal'
  import { facilities } from '$stores/facility'
  import { INVALID_FACILITY, type Facility } from '$models/pbc/facility'

  const dispatch = createEventDispatcher()

  export let facilityList: Facility[] = []
  export let facility: Facility = null
  export let multipleFacilities: Facility[] = [] // selections
  export let selected: string = undefined // facility name
  export let disabled = false
  export let multiple = false

  console.log({ selected })

  let facilitiesLoaded = new Promise(() => {})
  if (facilityList.length === 0) {
    facilities.fetch().then((facilities) => {
      facilityList = facilities
      facilitiesLoaded = Promise.resolve()
    })
  } else {
    facilitiesLoaded = Promise.resolve()
  }

  const emitUpdate = (newFacility: Facility) => {
    dispatch('update', newFacility)
  }

  const emitMultiUpdate = (selectedFacilities: Facility[]) => {
    dispatch('update-multiple', selectedFacilities)
  }
</script>

{#if multiple}
  <select
    multiple
    {disabled}
    name="facility"
    bind:value={multipleFacilities}
    on:change={() => emitMultiUpdate(multipleFacilities)}
  >
    {#await facilitiesLoaded}
      <option value={undefined}>Loading Facilities</option>
    {:then}
      <option disabled selected={!!!selected} value={null}>Select Facility</option>
      {#each facilityList as f}
        <option value={f} selected={selected === f.facility_name}
          >{f.facility_name}{f.state ? ',' : ''} {f.state}</option
        >
      {/each}
    {/await}
  </select>
{:else}
  <select name="facility" bind:value={facility} {disabled} on:change={() => emitUpdate(facility)}>
    {#await facilitiesLoaded}
      <option value={undefined}>Loading Facilities</option>
    {:then _}
      <option disabled selected={!!!selected} value={null}>Select Facility</option>
      {#if selected === INVALID_FACILITY.facility_name}
        <option disabled selected={selected === INVALID_FACILITY.facility_name} value={null}>
          Invalid Facility, select a new one
        </option>
      {/if}
      {#each facilityList as f}
        <option value={f} selected={selected === f.facility_name}
          >{f.facility_name}, {f.state}</option
        >
      {/each}
    {/await}
  </select>
{/if}

<style lang="scss">
  select {
    background: none;
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;

    font-size: 1rem;
    padding: 0.5rem;
    margin-bottom: 1rem;

    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 3px;

    width: 100%;
  }
</style>
