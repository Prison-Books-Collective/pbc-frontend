export interface Facility {
  id: number
  facility_name: string
  state: State
  facility_type: FacilityType
}

export enum FacilityType {
  JAIL = 'JAIL',
  STATE_PRISON = 'STATE_PRISON',
  FEDERAL_PRISON = 'FEDERAL_PRISON'
}

export enum State {
  NC = 'NC',
  AL = 'AL'
}

export const INVALID_FACILITY: Facility = {
  id: -1,
  facility_name: 'Invalid Facility',
  state: '' as any,
  facility_type: '' as any
}

export const invalidFacility: Facility = {
  id: undefined,
  facility_name: ' No Facility Provided ',
  state: '' as any,
  facility_type: '' as any
}
