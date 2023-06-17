import { BASE_PBC_URI } from '.'
import type { Book, Group } from '$models/pbc/shipment'
import { CONTENT_TYPE_JSON, METHOD_GET, METHOD_POST, uriQueryJoin } from '$util/web'

export const isNoISBNBook = (book: Book) => {
  return !book.isbn10 && !book.isbn13
}

export class BookService {
  public static readonly URI_GET_BOOK__ISBN = (isbn: string) =>
    `${BASE_PBC_URI}/getBookByISBN${uriQueryJoin({ isbn: isbn })}`
  public static readonly URI_CREATE_BOOK = `${BASE_PBC_URI}/addContent`
  public static readonly URI_UPDATE_BOOK = `${BASE_PBC_URI}/updateBook`
  public static readonly URI_SEARCH_BOOK_DB = (title: string, author = '') =>
    `${BASE_PBC_URI}/content${uriQueryJoin({ title, author })}`
  public static readonly URI_QUERY_GOOGLE = (title: string, author = '') =>
    `${BASE_PBC_URI}/queryGoogle${uriQueryJoin({ title, author })}`

  public static async findBook(isbn: string): Promise<Book | null> {
    let uri: string
    if (isbn.length != 10 && isbn.length != 13) {
      throw new Error(
        `Failed to find book with ISBN ${isbn}; this value is not a valid ISBN10 or ISBN13 value`,
      )
    } else {
      uri = this.URI_GET_BOOK__ISBN(isbn)
    }

    const response = await fetch(uri, { ...METHOD_GET })

    if (response.status === 204) return null
    if (response.status === 417) {
      const body = (await response.json()) as Book

      const bookUpdate = {
        ...(body as Book),
        needsAuthorAssistance: true,
        unclearAuthors: body.creators as Group[],
      }
      return bookUpdate
    }
    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${response.status} when searching for book with valid ISBN "${isbn}" from "${uri}"`,
      )
    }

    return (await response.json()) as Book
  }

  public static async createBook(book: Book): Promise<Book> {
    if (!book.isbn10 || book.isbn10.length === 0) {
      book.isbn10 = null
    }
    if (!book.isbn13 || book.isbn13.length === 0) {
      book.isbn13 = null
    }
    const bookToSubmit = {
      title: book.title,
      authors: book.authors,
      type: 'book',
      isbn10: book.isbn10,
      isbn13: book.isbn13,
      id: book.id ?? undefined,
    }
    const response = await fetch(this.URI_CREATE_BOOK, {
      ...METHOD_POST,
      headers: { ...CONTENT_TYPE_JSON },
      body: JSON.stringify(bookToSubmit),
    })

    if (response.status === 302) {
      throw new Error(`failed to create book; book already exists`)
    }
    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${response.status} when adding new book to "${
          this.URI_CREATE_BOOK
        }" with details: ${JSON.stringify(bookToSubmit)}`,
      )
    }

    return (await response.json()) as Book
  }

  public static async createBookNoISBN(book: Book): Promise<Book> {
    const response = await fetch(this.URI_CREATE_BOOK, {
      ...METHOD_POST,
      headers: { ...CONTENT_TYPE_JSON },
      body: JSON.stringify(book),
    })

    if (response.status === 302) {
      throw new Error(`failed to create book; book already exists`)
    }
    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${response.status} when adding new book to "${
          this.URI_CREATE_BOOK
        }" with details: ${JSON.stringify(book)}`,
      )
    }

    return (await response.json()) as Book
  }

  public static async searchBookByTitleAndAuthor(
    title: string,
    author: string,
  ): Promise<List<Book>> {
    try {
      const response = await fetch(this.URI_SEARCH_BOOK_DB(title, author))
      const books = await response.json()

      if (!!books && books.length > 0) return books
    } catch (error) {
      console.error(
        `Failed to search DB for books by title "${title}" and author "${author}" at URI "${this.URI_SEARCH_BOOK_DB(
          title,
          author,
        )}". Received error: `,
        error,
      )
    }

    try {
      const googleResponse = await fetch(this.URI_QUERY_GOOGLE(title, author))
      return await googleResponse.json()
    } catch (error) {
      console.error(
        `Failed to query Google for books by title "${title}" and author "${author}" at URI "${this.URI_QUERY_GOOGLE(
          title,
          author,
        )}". Received error: `,
        error,
      )
    }

    return []
  }

  //   public static async updateBook(book: Book): Promise<Book> {
  //     const response = await fetch(this.URI_UPDATE_BOOK, {
  //       ...METHOD_PUT,
  //       headers: { ...CONTENT_TYPE_JSON },
  //       body: JSON.stringify(book)
  //     })

  //     if (response.status !== 200) {
  //       throw new Error(
  //         `unexpected response ${response.status} when updating book via "${
  //           this.URI_UPDATE_BOOK
  //         }" with details: ${JSON.stringify(book)}`
  //       )
  //     }

  //     return (await response.json()) as Book
  //   }
  // }
}
