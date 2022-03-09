import { derived, writable } from 'svelte/store'
import { InmateService, isInmateNoID } from '$lib/services/pbc-service/inmate.service'
import { PackageService } from '$lib/services/pbc-service/package.service';
import type { InmateNoID } from '$lib/services/pbc-service/models/inmate'

interface LocalStorageInmate extends InmateNoID {
  [additionalFields: string]: any
}

const emptyInmate: LocalStorageInmate = {
  id: null,

  firstName: null,
  middleInitial: null,
  lastName: null,

  packages: null,
  location: null,
}

const createFocusedInmate = () => {
  const { subscribe, set } = writable(emptyInmate)

  const fetch = async ( id ) => {
    try {
      set( await InmateService.getInmateUnknownIdStatus( id ) )
    } catch( error ) {
      console.error( error )
      console.error( `failed to set store $focusedInmate via remote using ID "${ id }"` )
      reset()
    }
  }

  const reset = () => set({ ...emptyInmate })

  return {
    subscribe,
    reset,
    fetch,
  }
}

export const focusedInmate = createFocusedInmate()
export const focusedInmatePackages = derived(
  focusedInmate,
  $inmate => isInmateNoID( $inmate )
    ? PackageService.getPackagesForInmateNoID($inmate.id)
    : PackageService.getPackagesForInmate($inmate.id)
)
