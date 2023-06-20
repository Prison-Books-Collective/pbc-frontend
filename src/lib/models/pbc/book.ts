export interface Book {
  id?: number
  title: string
  authors: string[]

  type?: 'book'
}

export interface ISBNBook extends Book {
  isbn10?: string
  isbn13?: string
}
export type NoISBNBook = Book
