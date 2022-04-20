import { writable } from 'svelte/store'
import { FacilityService } from '$services/pbc/facility.service'

const createFacilityStore = () => {
  const { subscribe, set } = writable([])

  const fetch = async () => {
    try {
      const facilities = await FacilityService.getAllFacilities()
      set(facilities)
      return facilities
    } catch (error) {
      console.error(error)
      console.error(`failed to sync $facilities via remote`)
      return []
    }
  }

  const create = async ({ facilityName, facilityType, state }) => {
    try {
      const createdFacility = await FacilityService.createFacility({
        id: null,
        facility_name: facilityName,
        facility_type: facilityType,
        state
      })
      fetch()
      return createdFacility
    } catch (error) {
      console.error(error)
      console.error(
        `failed to create new facility for $facilities via remote using data: ${JSON.stringify({
          facilityName,
          facilityType,
          state
        })}`
      )
    }
  }

  return {
    subscribe,
    set,

    fetch,
    create
  }
}

export const facilities = createFacilityStore()
facilities.fetch()
