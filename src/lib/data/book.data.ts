import { shipmentContentClient } from '$services/bellbooks-backend/shipment-content.client'
import { AppStore } from '$util/store'
import { loading } from '../stores/loading'

import type { Book } from '$models/pbc/shipment'

const defaultBookList: Book[] = []
const defaultBook: Partial<Book> = {}

export class BookListStore extends AppStore<Book[]> {
  constructor() {
    super('BookListStore', defaultBookList)
  }

  public async fetch({ title, author }: { title: string; author: string }): Promise<Book[] | null> {
    loading.start()
    const books = await shipmentContentClient.searchBooks(title, author)
    loading.end()

    this.set(books)
    return books
  }

  public async sync(): Promise<Book[]> {
    return [...this.getLatest()]
  }

  public load(loadedData: Book[]): Book[] {
    this.set(loadedData)
    return loadedData
  }
}

export class SingleBookStore extends AppStore<Book> {
  constructor() {
    super('SingleBookStore', defaultBook as any)
  }

  public async fetch({ isbn }: { isbn: string }): Promise<Book | null> {
    loading.start()
    const book = await shipmentContentClient.getBook(isbn)
    loading.end()

    this.set(book ?? this.getLatest())
    return book ?? this.getLatest()
  }

  public async sync(): Promise<Book> {
    const book = this.getLatest()
    const shouldUpdate = !!book.id

    if (shouldUpdate) {
      loading.start()
      const updatedBook = (await shipmentContentClient.updateBook(book)) ?? this.getLatest()
      loading.end()

      this.set(updatedBook)
      return updatedBook
    }

    loading.start()
    const createdBook = (await shipmentContentClient.createBook(book)) ?? this.getLatest()
    loading.end()

    this.set(createdBook)
    return createdBook
  }

  public load(loadedData: Book): Book {
    this.set(loadedData)
    return loadedData
  }
}

export const books = new BookListStore()
export const createBook = new SingleBookStore()
