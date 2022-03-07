import { CONTENT_TYPE_JSON, METHOD_GET, METHOD_POST, METHOD_PUT } from '$lib/util/web';
import { BASE_PBC_URI } from './index';
import type { Book, NoISBNBook } from './models/book';

export class BookService {
	public static readonly URI_GET_BOOK__ISBN10 = (isbn: string) =>
		`${BASE_PBC_URI}/getIsbn10?isbn10=${isbn}`;
	public static readonly URI_GET_BOOK__ISBN13 = (isbn: string) =>
		`${BASE_PBC_URI}/getIsbn13?isbn13=${isbn}`;
	public static readonly URI_CREATE_BOOK = `${BASE_PBC_URI}/addBook`;
	public static readonly URI_CREATE_BOOK__NO_ISBN = `${BASE_PBC_URI}/addNoISBNBook`;
	public static readonly URI_UPDATE_BOOK = `${BASE_PBC_URI}/updateBook`;

	public static async findBook(isbn: string): Promise<Book | null> {
		let uri: string;
		if (isbn.length === 10) {
			uri = this.URI_GET_BOOK__ISBN10(isbn);
		} else if (isbn.length === 13) {
			uri = this.URI_GET_BOOK__ISBN13(isbn);
		} else {
			throw new Error(
				`Failed to find book with ISBN ${isbn}; this value is not a valid ISBN10 or ISBN13 value`
			);
		}

		const response = await fetch(uri, { ...METHOD_GET });

		if (response.status === 204) return null;
		if (response.status !== 200) {
			throw new Error(
				`unexpected response ${response.status} when searching for book with valid ISBN "${isbn}" from "${uri}"`
			);
		}

		return (await response.json()) as Book;
	}

	public static async createBook(book: Book): Promise<Book> {
		const response = await fetch(this.URI_CREATE_BOOK, {
			...METHOD_POST,
			headers: { ...CONTENT_TYPE_JSON },
			body: JSON.stringify(book)
		});

		if (response.status === 302) {
			throw new Error(`failed to create book; book already exists`);
		}
		if (response.status !== 200) {
			throw new Error(
				`unexpected response ${response.status} when adding new book to "${
					this.URI_CREATE_BOOK
				}" with details: ${JSON.stringify(book)}`
			);
		}

		return (await response.json()) as Book;
	}

	public static async createBookNoISBN(book: NoISBNBook): Promise<NoISBNBook> {
		const response = await fetch(this.URI_CREATE_BOOK__NO_ISBN, {
			...METHOD_POST,
			headers: { ...CONTENT_TYPE_JSON },
			body: JSON.stringify(book)
		});

		if (response.status === 302) {
			throw new Error(`failed to create book; book already exists`);
		}
		if (response.status !== 200) {
			throw new Error(
				`unexpected response ${response.status} when adding new book to "${
					this.URI_CREATE_BOOK__NO_ISBN
				}" with details: ${JSON.stringify(book)}`
			);
		}

		return (await response.json()) as Book;
	}

	public static async updateBook(book: Book): Promise<Book> {
		const response = await fetch(this.URI_UPDATE_BOOK, {
			...METHOD_PUT,
			headers: { ...CONTENT_TYPE_JSON },
			body: JSON.stringify(book)
		});

		if (response.status !== 200) {
			throw new Error(
				`unexpected response ${response.status} when updating book via "${
					this.URI_UPDATE_BOOK
				}" with details: ${JSON.stringify(book)}`
			);
		}

		return (await response.json()) as Book;
	}
}
