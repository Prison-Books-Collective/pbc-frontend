import type { Alert } from './alert'
import type { Book } from './shipment'
import type { Facility } from './facility'
import type { Inmate } from './inmate'
import type { Zine } from './zine'

export interface Package {
  id: number
  inmate?: Inmate
  inmateNoId?: Inmate

  books?: Book[]
  zines?: Zine[]
  noISBNBooks?: Book[]

  alert?: Alert
  facility?: Facility
  date: string
}

export const undefinedInmate = {
  firstName: 'Unavailable',
  middleInitial: undefined,
  lastName: 'Unavailable',
  id: 'No-ID',
  location: undefined
} as Inmate

export const resolveInmate = (pbcPackage: Package) =>
  pbcPackage.inmate || pbcPackage.inmateNoId || undefinedInmate

export const stringify = (p: Package) => {
  const inmate = p.inmate || p.inmateNoId || null
  return `
		${p.id}
    ${inmate.location ? 'no ID available' : 'has id'}
		${p.date}
		${p.alert?.information || ''}
		${p.facility?.facility_name || ''} ${p.facility?.facility_type || ''} ${p.facility?.state || ''}
		${p.books?.map((b) => `${b.title} ${b.authors.join(' ')} ${b.isbn10} ${b.isbn13}`).join(' ') || ''}
		${p.noISBNBooks?.map((b) => `${b.title} ${b.authors.join(' ')}`).join(' ') || ''}
		${p.zines?.map((z) => `${z.threeLetterCode} ${z.title}`).join(' ') || ''}
		${inmate?.id || ''}
		${inmate?.firstName || ''} ${inmate?.middleInitial ? inmate?.middleInitial + ' ' : ''}${
    inmate?.lastName || ''
  }
		${inmate?.location || ''}
	`
    .replace(/(\s+)/, '')
    .trim()
    .toLowerCase()
}
