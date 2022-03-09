import { writable } from 'svelte/store'
import { InmateService } from '$lib/services/pbc-service/inmate.service'
import type { InmateNoID } from '$lib/services/pbc-service/models/inmate'

const emptyInmate: Partial<InmateNoID> = {
  id: null,
  firstName: null,
  lastName: null,
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
