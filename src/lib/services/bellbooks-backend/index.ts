import { BASE_PBC_URI } from '$util/app-config'
import { uriQueryJoin, type QueryParamMap } from '$util/web'

export const createURI = (path: string, queryParams?: QueryParamMap) =>
  `${BASE_PBC_URI}/${path}${uriQueryJoin(queryParams ?? {})}`
