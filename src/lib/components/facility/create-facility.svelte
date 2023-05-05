<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { facilities } from '$stores/facility'
  import { State } from '$models/pbc/facility'
  import { isEmpty } from '$util/strings'

  const dispatch = createEventDispatcher()

  export let facilityName = null
  export let state: State = null

  const resetInput = () => {
    ;[facilityName, state] = [null, null]
  }

  const shouldDisableCreate = (facilityName, state) => isEmpty(facilityName) || isEmpty(state)

  const createFacility = async (facilityName, state) => {
    try {
      const createdFacility = await facilities.create({ facilityName, state })
      resetInput()
      dispatch('update', createdFacility)
    } catch (error) {
      dispatch('error', error)
    }
  }
</script>

<section>
  <h2>Add New Facility</h2>
  <form id="new-facility-form" on:submit|preventDefault={() => createFacility(facilityName, state)}>
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

    <button class="success" disabled={shouldDisableCreate(facilityName, state)}>
      Add Facility
    </button>
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
