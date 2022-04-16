<script lang="ts">
	import type { Book, NoISBNBook } from '$models/pbc/book';
	export let book: Book | NoISBNBook = null;
</script>

{#if book}
	<em>{book.title}</em>
	{#if book.authors && book.authors.length > 0}
		&mdash; {book.authors.join(', ')}
	{/if}
{/if}
