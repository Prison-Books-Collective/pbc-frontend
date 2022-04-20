<script lang="ts">
  import type { Book } from '$models/pbc/book'
  import type { Package } from '$models/pbc/package'
  import { PackageSearchMode } from '$util/routing'

  export let pbcPackage: Package = null
  export let isbn: string = ''
  export let author: string = ''
  export let title: string = ''
  let book: Book = null

  const findBook = ({ pbcPackage, isbn, author, title }) => {
    if (!pbcPackage) return

    let searchMode: PackageSearchMode
    if (isbn) searchMode = PackageSearchMode.ISBN
    if (author && title) searchMode = PackageSearchMode.AUTHOR_AND_TITLE

    console.log(`searching using mode: ${searchMode}`)

    if (
      searchMode === PackageSearchMode.AUTHOR_AND_TITLE &&
      pbcPackage.noISBNBooks &&
      pbcPackage.noISBNBooks.length > 0
    ) {
      const matchingBook = pbcPackage.noISBNBooks.find(
        (b) =>
          b.authors
            .map((s) => s.toLowerCase())
            .join(',')
            .includes(author.toLowerCase()) && b.title.toLowerCase().includes(title.toLowerCase())
      )
      if (matchingBook) {
        book = matchingBook
        return
      }
    }

    if (searchMode === PackageSearchMode.AUTHOR_AND_TITLE) {
      const matchingBook = pbcPackage.books.find(
        (b) =>
          b.authors
            .map((s) => s.toLowerCase())
            .join(',')
            .includes(author.toLowerCase()) && b.title.toLowerCase().includes(title.toLowerCase())
      )
      if (matchingBook) {
        book = matchingBook
        return
      }
    }

    if (searchMode === PackageSearchMode.ISBN) {
      const matchingBook = pbcPackage.books.find((b) => b.isbn10 === isbn || b.isbn13 === isbn)
      if (matchingBook) {
        book = matchingBook
        return
      }
    }
  }

  $: findBook({ pbcPackage, isbn, author, title })
</script>

{#if book}
  <h2>
    <span class="book-title">{book.title}</span>
    <span class="book-text">&emsp;by&emsp;</span>
    <span class="book-author">{book.authors?.[0]}</span>
  </h2>
{/if}

<style>
  .book-title {
    font-style: italic;
    color: #333;
  }

  .book-author {
    color: #333;
  }
</style>
