import { Alert } from './alert';
import { Book, NoISBNBook } from './book';
import { Inmate, InmateNoID } from './inmate';
import { Zine } from './zine';

export interface Package {
	id: number;
	inmate?: Inmate;
	inmateNoId?: InmateNoID;

	books?: Book[];
	zines?: Zine[];
	noISBNBooks?: NoISBNBook[];

	alert?: Alert;
}
