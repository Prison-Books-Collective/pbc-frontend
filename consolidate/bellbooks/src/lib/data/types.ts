import type { PackageContent } from '$db/types'

export type {
  Facility,
  HibernateSequence,
  Note,
  PackageContent,
  Recipient,
  RecipientSpecialRequests,
  Shipment,
  ShipmentContent,
  ShipmentNotes,
  SpecialRequest,
} from '$db/types'

export interface Book extends PackageContent {
  type: 'book'
  code: never
}

export interface Zine extends PackageContent {
  type: 'zine'
  isbn10: never
  isbn13: never
}

export enum State {
  NC = 'NC',
  AL = 'AL',
  TN = 'TN',
  WV = 'WV',
  KY = 'KY',
  MD = 'MD',
  VA = 'VA',
  DE = 'DE',
}

export enum SpecialRequestStatus {
  OPEN = 'OPEN',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum SpecialRequestCategory {
  VOCATIONAL = 'VOCATIONAL',
  EDUCATIONAL = 'EDUCATIONAL',
  CAREER_GROWTH = 'CAREER_GROWTH',
  FOREIGN_LANGUAGE = 'FOREIGN_LANGUAGE',
  LEGAL = 'LEGAL',
  SPIRITUAL_RELIGIOUS = 'SPIRITUAL_RELIGIOUS',
  OTHER = 'OTHER',
}
