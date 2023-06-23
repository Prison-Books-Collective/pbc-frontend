import { BASE_PBC_URI } from '.'
import {
  CONTENT_TYPE_JSON,
  METHOD_DELETE,
  METHOD_GET,
  METHOD_POST,
  METHOD_PUT,
  uriQueryJoin,
} from '$util/web'
import { INVALID_FACILITY, type Facility } from '$models/pbc/facility'
import { isEmpty } from '$util/strings'

export class FacilityService {
  public static readonly URI_GET_FACILITIES = `${BASE_PBC_URI}/getAllFacilities`
  public static readonly URI_CREATE_FACILITY = `${BASE_PBC_URI}/addFacility`
  public static readonly URI_UPDATE_FACILITY = `${BASE_PBC_URI}/updateFacility`
  public static readonly URI_DELETE_FACILITY = (id: string) =>
    `${BASE_PBC_URI}/deleteFacility${uriQueryJoin({ id })}`

  private static cachedFacilities: Facility[] = []

  public static async updateFacility(facility: Facility): Promise<Facility | null> {
    if (!facility.id) return null

    const response = await fetch(this.URI_UPDATE_FACILITY, {
      ...METHOD_PUT,
      headers: { ...CONTENT_TYPE_JSON },
      body: JSON.stringify({ ...facility, type: 'facility' }),
    })

    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${response.status} when updating Facility with ID "${
          facility.id
        }" at "${this.URI_GET_FACILITIES}" using payload ${JSON.stringify({
          ...facility,
          type: 'facility',
        })}`,
      )
    }
    this.cachedFacilities = []
    return response.json()
  }

  public static async deleteFacility(id: string): Promise<void> {
    if (isEmpty(id)) return

    const response = await fetch(this.URI_DELETE_FACILITY(id), {
      ...METHOD_DELETE,
    })

    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${response.status} when attempting to delete Facility with ID "${id}" at "${this.URI_GET_FACILITIES}"`,
      )
    }

    this.cachedFacilities = []
  }

  public static async getAllFacilities(): Promise<Facility[]> {
    if (this.cachedFacilities.length > 0) {
      return this.cachedFacilities
    }

    const response = await fetch(this.URI_GET_FACILITIES, {
      ...METHOD_GET,
      headers: { ...CONTENT_TYPE_JSON },
    })

    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${response.status} when retrieving list of facilities from ${this.URI_GET_FACILITIES}`,
      )
    }

    this.cachedFacilities = (await response.json()) as Facility[]
    return this.cachedFacilities
  }

  public static async createFacility(facility: Facility): Promise<Facility> {
    const response = await fetch(this.URI_CREATE_FACILITY, {
      ...METHOD_POST,
      headers: { ...CONTENT_TYPE_JSON },
      body: JSON.stringify({ ...facility, type: 'facility' }),
    })

    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${response.status} when creating facility "[${facility.state}] ${facility.facility_name} - ${facility.facility_type}" at "${this.URI_CREATE_FACILITY}"`,
      )
    }
    this.cachedFacilities = []
    return (await response.json()) as Facility
  }

  public static async resolveFacilityByName(facilityName: string): Promise<Facility> {
    if (!facilityName || facilityName === '') return null
    const allFacilities = await this.getAllFacilities()
    return allFacilities.find((facility) => facility.name === facilityName) || INVALID_FACILITY
  }
}
