<script lang="ts">
  import type { Book } from '$models/pbc/book'
  export let book: Book = null
</script>

{#if book}
  <em>{book.title}</em>
  {#if book.authors && book.authors.length > 0}
    &mdash; {book.authors.join(', ')}
  {/if}
{/if}
