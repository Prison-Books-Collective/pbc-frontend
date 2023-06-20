import { createURI } from '.'

import { HTTP_GET, HTTP_POST, HTTP_PUT, HTTP_DELETE, WebClient } from '$util/web'
import type { EndpointMap } from '$util/web'
import type { Book } from '$models/pbc/book'
import type { Zine } from '$models/pbc/zine'

export const ShipmentContentClientEndpoints = Object.freeze({
  GET_CONTENT: {
    method: HTTP_GET,
    uri: ({ id }) => createURI('getContent', { id }),
  },
  CREATE_CONTENT: {
    method: HTTP_POST,
    uri: () => createURI('addContent'),
  },
  UPDATE_CONTENT: {
    method: HTTP_PUT,
    uri: () => createURI('updateContent'),
  },
  DELETE_CONTENT: {
    method: HTTP_DELETE,
    uri: ({ id }) => createURI('deleteContent', { id }),
  },

  GET_BOOK: {
    method: HTTP_GET,
    uri: ({ isbn }) => createURI('getBookByISBN', { isbn }),
  },
  SEARCH_BOOKS: {
    method: HTTP_GET,
    uri: ({ title = '', author = '' }) => createURI('content', { title, author }),
  },
  GOOGLE_SEARCH_BOOKS: {
    method: HTTP_GET,
    uri: ({ title = '', author = '' }) => createURI('queryGoogle', { title, author }),
  },

  GET_ALL_ZINES: {
    method: HTTP_GET,
    uri: () => createURI('getAllZines'),
  },
}) satisfies EndpointMap

export class ShipmentContentClient extends WebClient<typeof ShipmentContentClientEndpoints> {
  constructor() {
    super('ShipmentContentClient', ShipmentContentClientEndpoints)
  }

  public async getContent(id: string): Promise<Book | Zine | null> {
    return this.fetch<never, Book | Zine>(this.endpoints.GET_CONTENT, { params: { id } })
  }

  public async getBook(isbn: string): Promise<Book | null> {
    return this.fetch<never, Book>(this.endpoints.GET_BOOK, { params: { isbn } })
  }

  public async getAllZines(): Promise<Zine[]> {
    // returns the list alphabetized by Code
    return (await this.alwaysFetch<never, Zine[]>(this.endpoints.GET_ALL_ZINES, [])).sort(
      (zineA, zineB) => zineA.code.localeCompare(zineB.code),
    )
  }

  public async searchBooks(title: string, author: string): Promise<Book[]> {
    const [databaseBooks, googleBooks] = await Promise.all([
      this.alwaysFetch<never, Book[]>(this.endpoints.SEARCH_BOOKS, [], {
        params: { title, author },
      }),
      this.alwaysFetch<never, Book[]>(this.endpoints.GOOGLE_SEARCH_BOOKS, [], {
        params: { title, author },
      }),
    ])

    return [...databaseBooks, ...googleBooks]
  }

  public async createBook(book: Omit<Book, 'id'>): Promise<Book | null> {
    return this.fetch<Omit<Book, 'id'>, Book>(this.endpoints.CREATE_CONTENT, {
      body: { ...book, type: 'book' },
    })
  }

  public async createZine(zine: Omit<Zine, 'id'>): Promise<Zine | null> {
    return this.fetch<Omit<Zine, 'id'>, Zine>(this.endpoints.CREATE_CONTENT, {
      body: { ...zine, type: 'zine' },
    })
  }

  public async updateBook(book: Book) {
    return this.fetch<Book, Book>(this.endpoints.UPDATE_CONTENT, {
      body: { ...book, type: 'book' },
    })
  }

  public async updateZine(zine: Zine): Promise<Zine | null> {
    return this.fetch<Zine, Zine>(this.endpoints.UPDATE_CONTENT, {
      body: { ...zine, type: 'zine' },
    })
  }

  public async deleteContent(id: string): Promise<boolean> {
    const deletion = await this.fetch<never, unknown>(this.endpoints.DELETE_CONTENT, {
      params: { id },
    })
    return !!deletion
  }
}
