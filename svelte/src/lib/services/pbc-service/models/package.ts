import type { Alert } from './alert';
import type { Book, NoISBNBook } from './book';
import type { Facility } from './facility';
import type { Inmate, InmateNoID } from './inmate';
import type { Zine } from './zine';

export interface Package {
	id: number;
	inmate?: Inmate;
	inmateNoId?: InmateNoID;

	books?: Book[];
	zines?: Zine[];
	noISBNBooks?: NoISBNBook[];

	alert?: Alert;
	facility?: Facility;
	date: string;
}
