import { isEmpty } from '$util/strings';

export interface Book {
	id: number;
	isbn10?: string;
	isbn13?: string;

	title: string;
	authors: string[];
}

export interface NoISBNBook {
	id: number;
	title: string;
	authors: string[];
}

export const bookHasISBN = (book: Book) => {
	return {
		isbn10: !isEmpty(book.isbn10) && !book.isbn10?.toLowerCase().startsWith('no-'),
		isbn13: !isEmpty(book.isbn13) && !book.isbn13?.toLowerCase().startsWith('no-'),
	}
}
