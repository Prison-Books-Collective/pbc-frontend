import { uriQueryJoin, type QueryParamMap } from '$util/web'

export const BASE_URI = import.meta.env.VITE_BASE_PBC_URI

export const createURI = (path: string, queryParams?: QueryParamMap) =>
  `${BASE_URI}/${path}${uriQueryJoin(queryParams ?? {})}`
