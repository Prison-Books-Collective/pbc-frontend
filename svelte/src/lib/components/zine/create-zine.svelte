<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { zines } from '$stores/zine'

  const dispatch = createEventDispatcher()

  export let threeLetterCode = null
  export let title = null

  const resetInput = () => {
    ;[threeLetterCode, title] = [null, null]
  }

  $: shouldDisableCreate =
    !threeLetterCode ||
    !title ||
    threeLetterCode.trim().length === 0 ||
    title.trim().length === 0 ||
    threeLetterCode.length > 5
  $: createZine = async () => {
    try {
      const createdZine = await zines.create({ threeLetterCode, title })
      resetInput()
      dispatch('update', createdZine)
    } catch (error) {
      dispatch('error', error)
    }
  }
</script>

<section>
  <h2>Add New Zine</h2>
  <form id="newZineForm" on:submit|preventDefault={createZine}>
    <label for="three-letter-code">
      Three Letter Code:
      <input
        type="text"
        name="three-letter-code"
        id="three-letter-code"
        placeholder="Zine Code"
        bind:value={threeLetterCode}
      />
    </label>

    <label for="title">
      Title:
      <input type="text" name="title" id="title" placeholder="Zine Title" bind:value={title} />
    </label>

    <button disabled={shouldDisableCreate} class="button-success">Add Zine</button>
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
