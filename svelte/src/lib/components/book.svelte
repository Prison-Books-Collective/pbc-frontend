<script lang="ts">
  import { getCreatorName, type Book } from '$models/pbc/shipment'
  export let book: Book = null

  let creators = book.creators.map(getCreatorName).join(', ')
</script>

{#if book}
  <em>{book.title}</em>
  {#if book.creators && book.creators.length > 0}
    &mdash; {creators}
  {/if}
{/if}
