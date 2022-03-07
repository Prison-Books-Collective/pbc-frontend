import { Package } from './package'

export interface Inmate {
  id: string

  firstName: string
  lastName: string
  middleInitial: string

  packages: Package[]
}

export interface InmateNoID extends Inmate {
  location: string
}
