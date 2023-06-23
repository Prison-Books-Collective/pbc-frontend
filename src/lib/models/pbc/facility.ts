export interface Facility {
  id: number
  name: string
  additionalInfo: string
  street: string
  city: string
  zip: string
  state: State
}

export enum State {
  NC = 'NC',
  AL = 'AL',
}

export const INVALID_FACILITY: Facility = Object.freeze({
  id: -1,
  name: 'Invalid Facility',
  state: '' as any,
  facility_type: '' as any,
  additionalInfo: '' as any,
  street: '' as any,
  city: '' as any,
  zip: '' as any,
})

export const NO_FACILITY_PROVIDED: Facility = Object.freeze({
  id: -2,
  name: ' No Facility Provided ',
  state: '' as any,
  facility_type: '' as any,
  additionalInfo: '' as any,
  street: '' as any,
  city: '' as any,
  zip: '' as any,
})

export const isValidFacility = (facility?: Facility) => {
  return !!facility && facility != INVALID_FACILITY && facility != NO_FACILITY_PROVIDED
}
