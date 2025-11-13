import uniqBy from 'lodash/uniqBy'

import { createURI } from '.'

import type { Book, Zine } from '$models/pbc/shipment'
import type { EndpointMap } from '$util/web'
import { HTTP_DELETE, HTTP_GET, HTTP_POST, HTTP_PUT, WebClient } from '$util/web'

export const ShipmentContentClientEndpoints = Object.freeze({
  GET_CONTENT: {
    method: HTTP_GET,
    uri: ({ id }) => createURI('getContent', { id }),
  },
  SEARCH_CONTENT: {
    method: HTTP_GET,
    uri: ({ title = '', author = '' }) => createURI('content', { title, author }),
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
    uri: ({ title = '', author = '' }) => createURI('searchBooks', { title, author }),
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
    // approach using individual endpoints, `uniqBy` later called with concatenated array of these two results
    // const [databaseBooks, googleBooks] = await Promise.all([
    //   this.alwaysFetch<never, Book[]>(this.endpoints.SEARCH_BOOKS, [], {
    //     params: { title, author },
    //   }),
    //   this.alwaysFetch<never, Book[]>(this.endpoints.GOOGLE_SEARCH_BOOKS, [], {
    //     params: { title, author },
    //   }),
    // ])

    const searchResults = await this.alwaysFetch<never, Book[]>(this.endpoints.SEARCH_BOOKS, [], {
      params: { title, author },
    })

    return uniqBy(
      uniqBy(searchResults, (book) => book.isbn10),
      (book) => book.isbn13,
    )
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

export const shipmentContentClient = new ShipmentContentClient()
