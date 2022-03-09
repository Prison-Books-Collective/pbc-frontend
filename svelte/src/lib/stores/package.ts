import { writable } from 'svelte/store';
import { isInmateNoID } from '$lib/services/pbc-service/inmate.service';
import { isNoISBNBook } from '$lib/services/pbc-service/book.service';
import type { Book, NoISBNBook } from '$lib/services/pbc-service/models/book';
import type { Facility } from '$lib/services/pbc-service/models/facility';
import type { Inmate, InmateNoID } from '$lib/services/pbc-service/models/inmate';
import type { Package } from '$lib/services/pbc-service/models/package';
import type { Zine } from '$lib/services/pbc-service/models/zine';

interface LocalStoragePackage extends Package {
	existsInDatabase: boolean;
}

const emptyPackage: LocalStoragePackage = {
	id: null,
	date: null,

	inmate: null,
	inmateNoId: null,
	facility: null,

	books: [],
	zines: [],
	noISBNBooks: [],

	alert: null,

	existsInDatabase: false
};

const createPackage = () => {
	const { subscribe, set, update } = writable(emptyPackage);

	const addBook = (book: Book | NoISBNBook) => {
		if (isNoISBNBook) {
			update((currentPackage) => ({
				...currentPackage,
				noISBNBooks: [...currentPackage.noISBNBooks, book]
			}));
		} else {
			update((currentPackage) => ({
				...currentPackage,
				books: [...currentPackage.books, book]
			}));
		}
	};
	const addZine = (zine: Zine) =>
		update((currentPackage) => ({
			...currentPackage,
			zines: [...currentPackage.zines, zine]
		}));

	const setInmate = (inmate: Inmate | InmateNoID) => {
		if (isInmateNoID(inmate)) {
			update((currentPackage) => ({
				...currentPackage,
				inmate: null,
				inmateNoId: inmate as InmateNoID
			}));
		} else {
			update((currentPackage) => ({
				...currentPackage,
				inmateNoId: null,
				inmate: inmate as Inmate
			}));
		}
	};
	const setDestination = (facility: Facility) =>
		update((currentPackage) => ({
			...currentPackage,
			facility
		}));

	const load = (pbcPackage: Package) => set({ ...pbcPackage, existsInDatabase: true });
	const reset = () => set({ ...emptyPackage });

	return {
		subscribe,
		set,

		addBook,
		addZine,

		setInmate,
		setDestination,

		load,
		reset
	};
};

export const newPackage = createPackage();
