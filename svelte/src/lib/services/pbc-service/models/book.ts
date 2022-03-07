export interface Book {
  id: number
  isbn10?: string
  isbn13?: string

  title: string
  authors: string[]
}

export interface NoISBNBook {
  id: number
  title: string
  authors: string[]
}
