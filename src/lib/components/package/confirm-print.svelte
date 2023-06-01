<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Book from '$components/book.svelte'
  import Zine from '$components/zine/zine.svelte'
  import { createShipment } from '$lib/data/shipment.data'

  const dispatch = createEventDispatcher()

  const doneClicked = () => dispatch('done')
  const printClicked = () => dispatch('print')
</script>

{#if $createShipment.id}
  <section id="package-success">
    <h1>Package Contents:</h1>

    <ol class="package-items-list">
      {#each $createShipment.content as book}
        <li>
          {#if book.type === 'book'}
            <Book {book} />
          {/if}
          {#if book.type === 'zine'}
            <Zine zine={book} />
          {/if}
        </li>
      {/each}
    </ol>
    <hr />

    <div id="print-options">
      <button class="success" on:click={printClicked}>Print Invoice?</button>
      <button on:click={doneClicked}>Done</button>
    </div>
  </section>
{/if}

<style lang="scss">
  #package-success {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
  }

  h1 {
    font-weight: normal;
    text-decoration: underline;
  }

  hr {
    width: 100%;
  }

  .package-items-list {
    text-align: left;
  }
</style>
