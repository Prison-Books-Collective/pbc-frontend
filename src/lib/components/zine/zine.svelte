<script lang="ts">
  import Modal from '$components/modal.svelte'
  import type { Zine } from '$models/pbc/shipment'
  import { ZineService } from '$services/pbc/zine.service'
  import { loading } from '$stores/loading'
  import { isEmpty } from '$util/strings'

  export let zine: Zine = null
  export let formatForInvoice = false

  let isModalVisible = false
  let zineUpdate = { ...zine }
  const showModal = () => (isModalVisible = true)
  const dismissModal = () => (isModalVisible = false)
  const requestDeleteZine = () => {
    const shouldDeleteZine = confirm(
      `This will completely delete zine "${zine.code} - ${zine.title}" and will affect all historical packages which contain this Zine. Are you sure you wish to continue?`,
    )

    if (!shouldDeleteZine) return
    deleteZine()
  }
  const deleteZine = async () => {
    loading.start()
    await ZineService.deleteZine(zine)
    loading.end()

    isModalVisible = false
  }
  $: isSubmitDisabled = () => isEmpty(zine.code) || isEmpty(zine.title)

  const saveZine = async (e: Event) => {
    e.preventDefault()

    loading.start()
    const updatedZine = await ZineService.updateZine(zineUpdate)
    loading.end()

    zine = updatedZine
    isModalVisible = false
  }

  const resetUpdate = async () => {
    zineUpdate = { ...zine }
  }
</script>

{#if zine}
  <Modal bind:visible={isModalVisible} width={'600px'} on:cancel={resetUpdate}>
    <article class="edit-zine">
      <form on:submit={saveZine}>
        <label>
          Code
          <input type="text" bind:value={zineUpdate.code} />
        </label>

        <label>
          Title
          <input type="text" bind:value={zineUpdate.title} />
        </label>

        <section class="form-buttons">
          <button on:click={dismissModal}>Cancel</button>
          <button on:click={requestDeleteZine} class="danger">Delete</button>
          <button class="success" type="submit" disabled={isSubmitDisabled()}>Save</button>
        </section>
      </form>
    </article>
  </Modal>

  <span class="link" on:click={showModal}>
    <strong>
      {#if formatForInvoice}
        ZINE
      {:else}
        {zine.code}
      {/if}
    </strong>
    &mdash;
    {zine.title}
  </span>
{/if}

<style lang="scss">
  .edit-zine {
    width: 100%;
  }

  .form-buttons {
    display: flex;
    flex-flow: row nowrap;
    align-items: stretch;
    justify-content: stretch;

    gap: 1em;

    .success {
      flex: 3;
    }
    .danger {
      flex: 1;
    }
  }
</style>
