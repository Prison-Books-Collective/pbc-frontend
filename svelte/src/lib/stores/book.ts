import {
  writable,
  type Subscriber,
  type Unsubscriber,
  type Updater,
  type Writable
} from 'svelte/store'
import type { Book } from '$models/pbc/shipment'
import { BookService, isNoISBNBook } from '$services/pbc/book.service'

export interface LocalStorageBook extends Book {
  [additionalFields: string]: any
}

export class FocusedBookStore implements Writable<LocalStorageBook> {
  private readonly defaultBook

  constructor(defaultBook: LocalStorageBook) {
    const { set, update, subscribe } = writable(defaultBook)

    this.set = set
    this.update = update
    this.subscribe = subscribe

    this.defaultBook = Object.freeze(defaultBook)
  }

  public set: (this: void, value: LocalStorageBook) => void
  public update: (this: void, updater: Updater<LocalStorageBook>) => void
  public subscribe: (
    this: void,
    run: Subscriber<LocalStorageBook>,
    invalidate?: (value?: LocalStorageBook) => void
  ) => Unsubscriber

  public reset() {
    this.set({ ...this.defaultBook })
  }

  public async fetchBookByISBN(isbn: string): Promise<Book> {
    if (!isbn || (isbn.length !== 10 && isbn.length !== 13)) return
    try {
      const foundBook = await BookService.findBook(isbn)
      if (!foundBook) throw new Error(`did not find book with ISBN ${isbn}`)
      const bookUpdate = {
        ...foundBook,
        existsInDatabase: true
      }
      this.set(bookUpdate)
      return bookUpdate
    } catch (error) {
      console.error(error)
      console.error(`failed to set store $focusedBook via remote using ISBN "${isbn}"`)
      const bookUpdate = {
        ...emptyBook,
        isbn10: isbn.length === 10 ? isbn : null,
        isbn13: isbn.length === 13 ? isbn : null,
        existsInDatabase: false
      }
      this.set(bookUpdate)
      return bookUpdate
    }
  }

  public async sync() {
    return new Promise((resolve, reject) => {
      this.update((book) => {
        let operation: Promise<Book>

        if (isNoISBNBook(book)) {
          operation = BookService.createBookNoISBN(book)
        } else {
          operation = book.existsInDatabase
            ? BookService.updateBook(book)
            : BookService.createBook(book)
        }

        operation
          .then((updatedBook) => {
            this.set({
              ...updatedBook,
              existsInDatabase: true
            })
            resolve({
              ...updatedBook,
              existsInDatabase: true
            })
          })
          .catch((error) => {
            console.error(error)
            console.error(
              `failed to sync $focusedBook via remote using data ${JSON.stringify(book)}`
            )
            this.set({
              existsInDatabase: false,
              ...book
            })
            reject({
              existsInDatabase: false,
              ...book
            })
          })

        return { ...book }
      })
    })
  }
}

const emptyBook: LocalStorageBook = {
  id: null,
  isbn10: null,
  isbn13: null,

  title: null,
  creators: [],
  type: 'book'
}

export const focusedBook = new FocusedBookStore(emptyBook)
