<script lang="ts">
	import type { Book, NoISBNBook } from '$models/pbc/book';

	export let book: Book | NoISBNBook = null;
</script>

{#if book}
	<em>{book.title}</em> &mdash; {book.authors.join(', ')}
{/if}
