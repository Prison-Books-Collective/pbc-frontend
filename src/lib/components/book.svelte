<script lang="ts">
  import type { Book } from '$models/pbc/shipment'
  export let book: Book = null
</script>

{#if book}
  <strong>{book.title}</strong>
  &mdash; {book.authors}
{/if}
