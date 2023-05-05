import { RecipientService } from '$services/pbc/recipient.service'
import { isEmpty } from '$util/strings'
import type { Recipient } from './recipient'

export interface PackageContent {
  id: number
  title: string
  type: string
}

export interface Book extends PackageContent {
  type: 'book'
  creators: Creator[]
  isbn10?: string
  isbn13?: string
}

export interface Creator {
  id: number
  type: string
}

export interface Author extends Creator {
  type: 'author'
  prefix: string
  firstName: string
  middleName: string
  lastName: string
  suffix: string
}

export interface Group extends Creator {
  type: 'group'
  name: string
}

export const getCreatorName = (creator: Creator): string => {
  if (creator.type === 'group') return (creator as Group).name
  if (creator.type === 'author') {
    const { prefix, firstName, middleName, lastName, suffix } = creator as Author
    return [prefix, firstName, middleName, lastName, suffix]
      .filter((item) => !isEmpty(item))
      .join(' ')
  }
}

export interface Zine extends PackageContent {
  type: 'zine'
  code: string
}

export interface Note {
  content: string
}

export interface Shipment {
  id: number
  content: PackageContent[]
  date: any
  recipient: Recipient
  notes: Note[]
  [additionalFields: string]: any
}

export const bookHasISBN = (book: Book) => {
  return {
    isbn10: !isEmpty(book.isbn10),
    isbn13: !isEmpty(book.isbn13)
  }
}
