import { writable } from 'svelte/store';
import type { Book, NoISBNBook } from '$lib/services/pbc-service/models/book';
import { BookService, isNoISBNBook } from '$lib/services/pbc-service/book.service';

interface LocalStorageBook extends Book {
	[additionalFields: string]: any;
}

const emptyBook: LocalStorageBook = {
	id: null,
	isbn10: null,
	isbn13: null,

	title: null,
	authors: [],

  existsInDatabase: false,
};

const createFocusedBook = () => {
	const { subscribe, set, update } = writable(emptyBook);

	const fetch = async (isbn) => {
    if(!isbn || (isbn.length !== 10 && isbn.length !== 13)) return
		try {
      set({ 
        ...await BookService.findBook(isbn), 
        existsInDatabase: true
      })
		} catch (error) {
			console.error(error);
			console.error(`failed to set store $focusedBook via remote using ISBN "${isbn}"`);
			reset();
		}
	};

  const sync = async () => update(book => {
    let operation: Promise<Book|NoISBNBook>

    if(isNoISBNBook(book)) {
      operation = BookService.createBookNoISBN(book)
    } else {
      if(book.existsInDatabase) {
        operation = BookService.updateBook(book)
      } else {
        operation = BookService.createBook(book)
      }
    }

    operation.then(updatedBook => set({
      ...updatedBook,
      existsInDatabase: true
    })).catch(error => {
      console.error(error)
      console.error(`failed to sync $focusedBook via remote using data ${JSON.stringify(book)}`)
      set({
        existsInDatabase: false, 
        ...book
      })
    })

    return {...book}
  })

	const reset = () => set({ ...emptyBook });

	return {
		subscribe,
		set,

		fetch,
    sync,
		reset,
	};
};

export const focusedBook = createFocusedBook();
