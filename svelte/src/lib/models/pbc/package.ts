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

export const stringify = (p: Package) => {
	const inmate = p.inmate || p.inmateNoId || null
	return `
		${p.id}
		${p.date}
		${p.alert?.information || ''}
		${p.facility?.facility_name || ''} ${p.facility?.facility_type || ''} ${p.facility?.state || ''}
		${p.books?.map(b => `${b.title} ${b.authors.join(' ')} ${b.isbn10} ${b.isbn13}`).join(' ') || ''}
		${p.noISBNBooks?.map(b => `${b.title} ${b.authors.join(' ')}`).join(' ') || ''}
		${p.zines?.map(z => `${z.threeLetterCode} ${z.title}`).join(' ') || ''}
		${inmate?.id || ''}
		${inmate?.firstName || ''} ${inmate?.middleInitial ? inmate?.middleInitial + ' ' : ''}${inmate?.lastName || ''}
		${inmate?.location || ''}
	`.replace(/(\s+)/, '').trim().toLowerCase()
}
