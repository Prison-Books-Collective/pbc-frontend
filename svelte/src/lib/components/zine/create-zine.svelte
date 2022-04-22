<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { zines } from '$stores/zine'
  import { isEmpty } from '$util/strings'

  const dispatch = createEventDispatcher()

  export let threeLetterCode = null
  export let title = null

  const resetInput = () => {
    ;[threeLetterCode, title] = [null, null]
  }

  const shouldDisableCreate = (threeLetterCode, title) =>
    isEmpty(threeLetterCode) || isEmpty(title) || threeLetterCode.length > 5

  const createZine = async (threeLetterCode, title) => {
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
  <form id="newZineForm" on:submit|preventDefault={() => createZine(threeLetterCode, title)}>
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

    <button disabled={shouldDisableCreate(threeLetterCode, title)} class="success">Add Zine</button>
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
