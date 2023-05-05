import type { Package } from './package'
import type { Recipient } from './recipient'

export interface Inmate {
  id: string

  firstName: string
  lastName: string
  middleInitial: string

  packages: Package[]

  location?: string
}

export const isInmateNoID = (inmate: Recipient) => {
  return !inmate.assignedId
}
