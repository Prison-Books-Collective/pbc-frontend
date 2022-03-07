export interface Facility {
	id: number;
	facility_name: string;
	state: State;
	facility_type: FacilityType;
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
