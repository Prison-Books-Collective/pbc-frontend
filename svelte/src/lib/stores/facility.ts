import {
  writable,
  type Subscriber,
  type Unsubscriber,
  type Updater,
  type Writable
} from 'svelte/store'
import type { Facility } from '$models/pbc/facility'
import { FacilityService } from '$services/pbc/facility.service'

export class FacilityStore implements Writable<Facility[]> {
  constructor() {
    const { set, update, subscribe } = writable([])

    this.set = set
    this.update = update
    this.subscribe = subscribe
  }

  public set: (value: Facility[]) => void
  public update: (updater: Updater<Facility[]>) => void
  public subscribe: (
    run: Subscriber<Facility[]>,
    invalidate?: (value?: Facility[]) => void
  ) => Unsubscriber

  public reset() {
    this.set([])
  }

  public async fetch(): Promise<Facility[]> {
    try {
      const facilities = await FacilityService.getAllFacilities()
      this.set(facilities)
      return facilities
    } catch (error) {
      console.error(error)
      console.error(`failed to sync $facilities via remote`)
      this.reset()
      return []
    }
  }

  public async create({ facilityName, facilityType, state }): Promise<Facility> {
    try {
      const createdFacility = await FacilityService.createFacility({
        id: null,
        facility_name: facilityName,
        facility_type: facilityType,
        state
      })
      this.fetch()
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
}

export const facilities = new FacilityStore()
facilities.fetch()
