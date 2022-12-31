<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { isInmateNoID, type Inmate } from '$models/pbc/inmate'
  import editIcon from '$assets/icons/edit.png'
  import Modal from '$components/modal.svelte'
  import EditInmate from '$components/inmate/edit-inmate.svelte'

  const dispatch = createEventDispatcher()

  export let inmate: Inmate
  export let shouldDisplayModal = false

  const presentModal = () => (shouldDisplayModal = true)
  const closeModal = () => (shouldDisplayModal = false)

  const onUpdateInmate = (event) => {
    closeModal()
    dispatch('update', event.detail)
  }
  const onUpdateInmateError = (event) => {
    closeModal()
    dispatch('error', event.detail)
  }
</script>

<Modal bind:visible={shouldDisplayModal}>
  <EditInmate {inmate} on:update={onUpdateInmate} on:error={onUpdateInmateError} />
</Modal>

<div id="inmate-name">
  <h1 aria-label="Inmate's first and last name, and inmate ID if available">
    {inmate.firstName}
    {inmate.middleInitial ? inmate.middleInitial + '. ' : ''}{inmate.lastName}
    {#if isInmateNoID(inmate)}
      - <span>{inmate.location}</span>
    {:else}
      &ensp;<span>ID#{inmate.assignedId}</span>
    {/if}

    <img
      src={editIcon}
      class="icon"
      alt="edit icon; click to edit inmate information"
      on:click={presentModal}
    />
  </h1>
</div>

<style lang="scss">
  #inmate-name {
    display: flex;
    flex-flow: row wrap;
    align-self: center;

    justify-content: space-between;
    align-items: center;

    span {
      color: darkslategray;
      font-weight: 700;
      font-size: 1.75rem;
    }
  }
</style>
