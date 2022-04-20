<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { facilities } from '$stores/facility'
  import { FacilityType, State } from '$models/pbc/facility'

  const dispatch = createEventDispatcher()

  export let facilityName = null
  export let facilityType: FacilityType = null
  export let state: State = null

  const resetInput = () => {
    ;[facilityName, facilityType, state] = [null, null, null]
  }

  $: shouldDisableCreate =
    !facilityName || !facilityType || !state || facilityName.trim().length === 0
  $: createFacility = async () => {
    try {
      const createdFacility = await facilities.create({ facilityName, facilityType, state })
      resetInput()
      dispatch('update', createdFacility)
    } catch (error) {
      dispatch('error', error)
    }
  }
</script>

<section>
  <h2>Add New Facility</h2>
  <form id="new-facility-form" on:submit|preventDefault={createFacility}>
    <label for="facility-name">
      Facility Name:
      <input
        type="text"
        name="facility-name"
        id="facility-name"
        placeholder="Facility Name"
        bind:value={facilityName}
      />
    </label>

    <select bind:value={state}>
      <option disabled selected value={null}>State of Operation</option>
      {#each Object.values(State) as s}
        <option value={s}>{s}</option>
      {/each}
    </select>

    <select bind:value={facilityType}>
      <option disabled selected value={null}>Facility Type</option>
      {#each Object.values(FacilityType) as f}
        <option value={f}>{f}</option>
      {/each}
    </select>

    <button disabled={shouldDisableCreate} class="button-success">Add Facility</button>
  </form>
</section>

<style>
  section {
    max-width: 400px;
    width: 100%;
  }

  button {
    width: 100%;
    margin: 0px;
  }
</style>
