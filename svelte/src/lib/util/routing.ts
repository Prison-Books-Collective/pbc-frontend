import { INMATE_SEARCH_MODE } from '$lib/../routes/inmate/[mode]/[firstName]-[lastName].svelte'

export const ROUTE_OVERVIEW = ( inmateID ) => `/overview/${ inmateID }`
export const ROUTE_INMATE_CREATE = ({ firstName, lastName }) => `/inmate/${ INMATE_SEARCH_MODE.CREATE }/${ firstName }-${ lastName }`
export const ROUTE_INMATE_DISAMBIGUATION = ({ firstName, lastName }) => `/inmate/${ INMATE_SEARCH_MODE.DISAMBIGUATION }/${ firstName }-${ lastName }`