<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { zines } from '$stores/zine'
  import { isEmpty } from '$util/strings'

  const dispatch = createEventDispatcher()

  export let code: string
  export let title: string

  const resetInput = () => {
    ;[code, title] = ['', '']
  }

  const shouldDisableCreate = (code: string, title: string) =>
    isEmpty(code) || isEmpty(title) || code.length > 5

  const createZine = async (code: string, title: string) => {
    try {
      const createdZine = await zines.create({ code, title })
      resetInput()
      dispatch('update', createdZine)
    } catch (error) {
      dispatch('error', error)
    }
  }
</script>

<h2>Add New Zine</h2>
<form id="create-zine" on:submit|preventDefault={() => createZine(code, title)}>
  <label for="zine-code">
    Zine Code:
    <input
      type="text"
      name="zine-code"
      id="zine-code"
      placeholder="3-Letter Zine Code"
      bind:value={code}
    />
  </label>

  <label for="title">
    Title:
    <input type="text" name="title" id="title" placeholder="Zine Title" bind:value={title} />
  </label>

  <button type="submit" class="success" disabled={shouldDisableCreate(code, title)}>
    Add Zine
  </button>
</form>

<style>
  form {
    display: contents;
  }

  button {
    width: 100%;
  }
</style>
