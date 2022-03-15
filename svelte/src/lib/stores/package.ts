import { writable } from 'svelte/store';
import { isInmateNoID } from '$lib/services/pbc-service/inmate.service';
import { isNoISBNBook } from '$lib/services/pbc-service/book.service';
import { PackageService } from '$lib/services/pbc-service/package.service';
import type { Book, NoISBNBook } from '$lib/services/pbc-service/models/book';
import type { Facility } from '$lib/services/pbc-service/models/facility';
import type { Inmate, InmateNoID } from '$lib/services/pbc-service/models/inmate';
import type { Package } from '$lib/services/pbc-service/models/package';
import type { Zine } from '$lib/services/pbc-service/models/zine';
import { formatDate } from '$lib/util/time';

interface LocalStoragePackage extends Package {
	existsInDatabase: boolean;
}

const emptyPackage: LocalStoragePackage = {
	id: null,
	date: formatDate(new Date()),

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
		if (isNoISBNBook(book)) {
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

	const createAlert = (alertText = '') => {
		update((currentPackage) => ({
			...currentPackage,
			alert: {
				id: null,
				information: alertText
			}
		}));
	};

	const removeItemsById = (...ids: (string | number)[]) => {
		update((currentPackage) => {
			let { books, noISBNBooks, zines } = currentPackage;

			ids.forEach((id) => {
				books = books.filter((b) => b.id != id);
				noISBNBooks = noISBNBooks.filter((b) => b.id != id);
				zines = zines.filter((z) => z.id != id);
			});

			return {
				...currentPackage,
				books,
				noISBNBooks,
				zines
			};
		});
	};

	const fetch = async (packageId: number) => {
		try {
			const pbcPackage = await PackageService.getPackage(packageId)
			load(pbcPackage)
		} catch(error) {
			console.error(error)
			console.error(`failed to retrieve package with ID "${packageId}" via remote`)
		}
	}
	const load = (pbcPackage: Package) => set({ ...pbcPackage, existsInDatabase: true });
	const reset = () => set({ ...emptyPackage });

	return {
		subscribe,
		set,

		addBook,
		addZine,

		setInmate,
		setDestination,

		createAlert,

		removeItemsById,

		fetch,
		load,
		reset
	};
};

export const focusedPackage = createPackage();
