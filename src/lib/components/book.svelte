<script lang="ts">
  import type { Book } from '$models/pbc/shipment'
  export let book: Book | null = null
</script>

{#if !!book}
  <strong>{book.title}</strong>
  {#if !!book.authors && book.authors.length > 0}
    &mdash; {book.authors}
  {/if}
{/if}
