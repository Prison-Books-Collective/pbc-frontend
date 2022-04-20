import type { Package } from './package'

export interface Inmate {
  id: string

  firstName: string
  lastName: string
  middleInitial: string

  packages: Package[]

  location?: string
}

export const isInmateNoID = (inmate: Inmate) => {
  return !!inmate['location']
}
