import { BASE_PBC_URI } from '.'
import type { Note, Shipment } from '$models/pbc/shipment'
import {
  CONTENT_TYPE_JSON,
  METHOD_GET,
  METHOD_POST,
  METHOD_DELETE,
  METHOD_PUT,
  uriQueryJoin,
} from '$util/web'

const removeExistsInDatabaseTag = (shipment: Shipment) => {
  if (shipment['existsInDatabase'] != null) {
    delete shipment['existsInDatabase']
  }
  shipment.content.forEach((shipmentContent) => {
    if (shipmentContent.type == 'book') {
      if (shipmentContent['existsInDatabase'] != null) {
        delete shipmentContent['existsInDatabase']
      }
    }
  })

  return shipment
}
export class ShipmentService {
  public static readonly URI_GET_SHIPMENT = (shipmentId: number) =>
    `${BASE_PBC_URI}/getShipment${uriQueryJoin({ id: shipmentId })}`
  public static readonly URI_CREATE_PACKAGE = `${BASE_PBC_URI}/addShipment`
  public static readonly URI_CREATE_NOTE = `${BASE_PBC_URI}/addNote`
  public static readonly URI_UPDATE_PACKAGE = `${BASE_PBC_URI}/updateShipment`
  public static readonly URI_GET_PACKAGES__BY_DATE_RANGE = (start: string, end: string) =>
    `${BASE_PBC_URI}/getShipmentsBetweenDates${uriQueryJoin({ startDate: start, endDate: end })}`
  public static readonly URI_DELETE_PACKAGE = (packageId: number) =>
    `${BASE_PBC_URI}/deleteShipment?id=${packageId}`

  public static async getShipment(packageId: number): Promise<Shipment> {
    const response = await fetch(this.URI_GET_SHIPMENT(packageId), { ...METHOD_GET })

    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${
          response.status
        } when retrieving package with ID "${packageId}" at "${this.URI_GET_SHIPMENT(packageId)}"`,
      )
    }

    return (await response.json()) as Shipment
  }

  public static async getPackagesForDateRange(
    startDate: string,
    endDate: string,
  ): Promise<Shipment[]> {
    console.log('in fetch')
    const response = await fetch(this.URI_GET_PACKAGES__BY_DATE_RANGE(startDate, endDate), {
      ...METHOD_GET,
    })

    if (response.status === 204) return []
    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${
          response.status
        } when retrieving packages by date range using input "${startDate}, ${endDate}" at "${this.URI_GET_PACKAGES__BY_DATE_RANGE(
          startDate,
          endDate,
        )}"`,
      )
    }

    return ((await response.json()) as Shipment[]).sort(packageSortByDate)
  }

  public static async saveNote(rejectionContent: string) {
    const note = { content: rejectionContent }
    const response = await fetch(this.URI_CREATE_NOTE, {
      ...METHOD_POST,
      headers: { ...CONTENT_TYPE_JSON },
      body: JSON.stringify(note),
    })
    if (response.status !== 200) {
      throw new Error(`unexpected response ${response.status} when creating note`)
    }

    return (await response.json()) as Note
  }

  public static async createPackage(pbcPackage: Shipment): Promise<Shipment> {
    const response = await fetch(this.URI_CREATE_PACKAGE, {
      ...METHOD_POST,
      headers: { ...CONTENT_TYPE_JSON },
      body: JSON.stringify(pbcPackage),
    })

    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${response.status} when creating package: ${JSON.stringify(
          pbcPackage,
        )}`,
      )
    }

    return (await response.json()) as Shipment
  }

  public static async updatePackage(pbcPackage: Shipment): Promise<Shipment> {
    const shipment = removeExistsInDatabaseTag(pbcPackage)
    const response = await fetch(this.URI_UPDATE_PACKAGE, {
      ...METHOD_PUT,
      headers: { ...CONTENT_TYPE_JSON },
      body: JSON.stringify(shipment),
    })

    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${response.status} when updating package at "${
          this.URI_UPDATE_PACKAGE
        }" with details: ${JSON.stringify(shipment)}`,
      )
    }

    return (await response.json()) as Shipment
  }
  // returns true when successfully deleted; otherwise throws an error
  public static async deletePackage(packageId: number): Promise<boolean> {
    const response = await fetch(this.URI_DELETE_PACKAGE(packageId), { ...METHOD_DELETE })

    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${
          response.status
        } when deleting package with ID ${packageId} from ${this.URI_DELETE_PACKAGE(packageId)}`,
      )
    }

    return true
  }
}

const packageSortByDate = (packageA: Package, packageB: Package) => {
  const [dateA, dateB] = [new Date(packageA.date), new Date(packageB.date)]
  if (dateA === dateB) return 0
  return dateA > dateB ? -1 : 1
}
