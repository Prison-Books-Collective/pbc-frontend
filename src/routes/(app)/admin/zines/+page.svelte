<script lang="ts">
  import { fly } from 'svelte/transition'

  import { zines } from '$stores/zine'
  import trashIcon from '$assets/icons/trash.png'

  import { ZineService } from '$services/pbc/zine.service'
  import { loading } from '$stores/loading'
  import { isEmpty } from 'lodash'
  import type { Zine } from '$models/pbc/shipment'

  let expandIndex: number | null = null
  let inputTitle: string
  let inputCode: string

  const toggleExpand = (index: number) => {
    if (expandIndex == index) return (expandIndex = null)
    expandIndex = index

    inputTitle = $zines[index]?.title ?? ''
    inputCode = $zines[index]?.code ?? ''
  }

  const shouldDisableSubmit = ({ code = '', title = '' }) => {
    return isEmpty(title) || isEmpty(code) || code.length > 5 || code.length < 2
  }

  const updateZine = async (id: string | number | undefined, code: string, title: string) => {
    if (!id) return

    loading.start()
    await ZineService.updateZine({ id, title, code })
    await zines.fetch()
    loading.end()

    expandIndex = null
  }

  const createZine = async (code: string, title: string) => {
    loading.start()
    await ZineService.createZine({ title, code })
    await zines.fetch()
    loading.end()

    expandIndex = null
  }

  const confirmDeleteZine = (zine: Zine) => {
    const shouldDelete = confirm(
      `Are you sure you want to permanently delete "${zine.code}: ${zine.title}"? Note that this will not succeed if the zine is contained by any existing packages.`,
    )
    if (!shouldDelete) return
    deleteZine(zine)
  }

  const deleteZine = async (zine: Zine) => {
    loading.start()
    await ZineService.deleteZine(zine)
    await zines.fetch()
    loading.end()

    expandIndex = null
  }
</script>

<main data-layout="page">
  <h1>Manage Zines</h1>

  <section class="list">
    <article class="list-item list-header expandable" class:expanded={expandIndex === -1}>
      <h2 on:click={() => toggleExpand(-1)}>Add New Zine</h2>

      {#if -1 === expandIndex}
        <form
          class="create-form"
          out:fly
          on:submit|preventDefault={() => createZine(inputCode, inputTitle)}
        >
          <label for="create-zine-code">
            Zine Code
            <input
              id="create-zine-code"
              name="create-zine-code"
              type="text"
              placeholder="Code"
              bind:value={inputCode}
            />
          </label>

          <label for="create-zine-title">
            Zine Title
            <input
              id="create-zine-title"
              name="create-zine-title"
              type="text"
              placeholder="Zine Title"
              bind:value={inputTitle}
            />
          </label>
          <section class="form-controls">
            <button type="button" on:click={() => toggleExpand(-1)}>Cancel</button>
            <button
              type="submit"
              class="success"
              disabled={shouldDisableSubmit({ code: inputCode, title: inputTitle })}
            >
              Create Zine
            </button>
          </section>
        </form>
      {/if}
    </article>

    {#each $zines as zine, index}
      <article class="list-item expandable" class:expanded={expandIndex === index}>
        <p on:click={() => toggleExpand(index)}>
          <span class="zine-code">{zine.code}</span>
          <span class="zine-title">{zine.title}</span>
        </p>

        {#if index === expandIndex}
          <form
            class="update-form"
            out:fly
            on:submit|preventDefault={() => updateZine(zine.id, inputCode, inputTitle)}
          >
            <label for="update-zine-code">
              New Code
              <input
                id="update-zine-code"
                name="update-zine-code"
                type="text"
                placeholder="New Code"
                bind:value={inputCode}
              />
            </label>

            <label for="update-zine-title">
              New Title
              <input
                id="update-zine-title"
                name="update-zine-title"
                type="text"
                placeholder="New Title"
                bind:value={inputTitle}
              />
            </label>

            <section class="form-controls">
              <button type="button" on:click={() => toggleExpand(index)}>Cancel</button>
              <button type="button" class="danger" on:click={() => confirmDeleteZine(zine)}>
                <img class="icon" alt="Delete Zine, Trash Icon" src={trashIcon} />
              </button>
              <button
                type="submit"
                class="success"
                disabled={shouldDisableSubmit({ code: inputCode, title: inputTitle })}
              >
                Update
              </button>
            </section>
          </form>
        {/if}
      </article>
    {/each}
  </section>
</main>

<style lang="scss">
  [data-layout='page'] {
    display: grid;
    grid-template-areas:
      'header'
      'content'
      'footer';
    grid-template-rows:
      7rem
      1fr
      7rem;
    margin: auto;
    max-width: 1200px;
  }

  h1 {
    line-height: 3rem;
    margin-block: 2rem;
  }

  .list {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
    width: 100%;

    &:has(.expanded) {
      .list-item {
        color: rgb(0 0 0 / 0.3);
      }
      .list-item.expanded {
        color: #232020;
      }
    }
  }

  .list-item {
    display: grid;
    grid-template-areas:
      'header'
      'form';
    grid-template-rows: auto 0px;
    transition-duration: 0.3s;

    padding: 1rem;
    background-color: #f6efe9;
    box-shadow: 0px 0px 10px rgb(0 0 0 / 0.3);

    &.expanded {
      grid-template-rows: auto 8.9rem;
    }

    p {
      grid-area: header;
      display: grid;
      grid-template-columns: 1fr 3fr;
      margin: 0.5rem;

      cursor: pointer;

      .zine-code {
        font-weight: 600;
        align-self: center;
      }
    }

    h2 {
      grid-area: header;
      text-align: center;

      cursor: pointer;
    }
  }

  .list-header {
    display: grid;
    grid-template-areas:
      'header'
      'form';
  }

  .expandable {
    transition: all 0.3s ease-in-out;
  }

  form {
    grid-area: form;
    display: grid;
    grid-template-areas:
      'code title'
      'control control';
    grid-template-columns: 7rem 1fr;
    gap: 0.5rem;

    label {
      margin-bottom: 0px;
      margin-top: 1.25rem;
    }

    label[for~='code'] {
      grid-area: code;
    }

    label[for~='title'] {
      grid-area: title;
    }

    .form-controls {
      grid-area: control;
      display: flex;
      flex-flow: row nowrap;
      justify-content: stretch;
      align-items: stretch;
      gap: 0.5rem;
      overflow: hidden;

      [type='submit'] {
        flex-grow: 3;
        flex-shrink: 1;
      }

      [type='button'].danger {
        flex-shrink: 1;
      }

      [type='button']:not(.danger) {
        flex-grow: 1;
        flex-shrink: 3;
      }
    }
  }

  .icon {
    filter: invert(100%);
    -webkit-filter: invert(100%);
    opacity: 1;
    max-height: 0.6rem;
    transform: scale(2);
  }
</style>
