import { INMATE_SEARCH_MODE } from '$lib/../routes/inmate/[mode].svelte'

export const ROUTE_OVERVIEW = ( inmateID ) => `/overview/${ inmateID }`
export const ROUTE_INMATE_CREATE_NAMED = ({ firstName, lastName }) => `/inmate/${ INMATE_SEARCH_MODE.CREATE }?firstName=${ firstName }&lastName=${ lastName }`
export const ROUTE_INMATE_CREATE_ID = ( inmateID ) => `/inmate/${ INMATE_SEARCH_MODE.CREATE }?id=${ inmateID }`
export const ROUTE_INMATE_DISAMBIGUATION = ({ firstName, lastName }) => `/inmate/${ INMATE_SEARCH_MODE.DISAMBIGUATION }?firstName=${ firstName }&lastName=${ lastName }`