import { isEmpty } from '$util/strings'
import type { Facility } from './facility'
import type { Recipient } from './recipient'

export interface PackageContent {
  id?: number
  title: string
  type?: string
}

export interface Book extends PackageContent {
  type?: 'book'
  authors: string
  isbn10?: string
  isbn13?: string
}

export interface Zine extends PackageContent {
  type?: 'zine'
  code: string
}

export interface Note {
  content: string
}

export interface Shipment {
  id: number
  content: PackageContent[]
  date: any
  recipient: Partial<Recipient>
  notes: Note[]
  facility: Facility
  [additionalFields: string]: any
}

export const bookHasISBN = (book: Book) => {
  return {
    isbn10: !isEmpty(book.isbn10 ?? ''),
    isbn13: !isEmpty(book.isbn13 ?? ''),
  }
}
