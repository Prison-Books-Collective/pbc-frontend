export enum VALID_HOMEPAGE_SEARCHES {
	ID = 'id',
	NAME = 'name'
}

export enum INMATE_SEARCH_MODE {
	CREATE = 'create',
	DISAMBIGUATION = 'disambiguation'
}

export const ROUTE_PACKAGES_FOR_INMATE = (inmateID) => `/packages/${inmateID}`;
export const ROUTE_INMATE_CREATE_NAMED = ({ firstName, lastName }) =>
	`/create/inmate?firstName=${firstName}&lastName=${lastName}`;
export const ROUTE_INMATE_CREATE_ID = (inmateID) =>
	`/create/inmate?id=${inmateID}`;
export const ROUTE_INMATE_SEARCH = ({firstName, lastName}) =>
	`/search/inmates?firstName=${firstName}&lastName=${lastName}`