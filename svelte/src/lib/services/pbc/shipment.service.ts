import { BASE_PBC_URI } from '.'
import type { Book, Note, Shipment } from '$models/pbc/shipment'
import { CONTENT_TYPE_JSON, METHOD_GET, METHOD_POST, METHOD_DELETE, METHOD_PUT, uriQueryJoin } from '$util/web'

const removeExistsInDatabaseTag = (shipment: Shipment) => {
  if (shipment["existsInDatabase"]!= null){
    delete shipment["existsInDatabase"]
  }
  shipment.content.forEach((shipmentContent) => {
    if (shipmentContent.type=="book"){
      if (shipmentContent["existsInDatabase"] != null){
        delete shipmentContent["existsInDatabase"]
      }
    }

  })

  return shipment
}
export class ShipmentService {

   
    public static readonly URI_GET_SHIPMENT = (shipmentId: number) =>
    `${BASE_PBC_URI}/getShipment${uriQueryJoin({id: shipmentId})}`
    public static readonly URI_CREATE_PACKAGE = `${BASE_PBC_URI}/addShipment`
    public static readonly URI_CREATE_NOTE = `${BASE_PBC_URI}/addNote`
    public static readonly URI_UPDATE_PACKAGE = `${BASE_PBC_URI}/updateShipment`

    public static async getShipment(packageId: number): Promise<Shipment> {
      const response = await fetch(this.URI_GET_SHIPMENT(packageId), { ...METHOD_GET })
  
      if (response.status !== 200) {
        throw new Error(
          `unexpected response ${
            response.status
          } when retrieving package with ID "${packageId}" at "${this.URI_GET_SHIPMENT(packageId)}"`
        )
      }
  
      return (await response.json()) as Shipment
    }

    public static async saveNote(rejectionContent: string) {
      let note = {content: rejectionContent}
      console.log(note)
      const response = await fetch(this.URI_CREATE_NOTE, {
        ...METHOD_POST,
        headers: {...CONTENT_TYPE_JSON},
        body: JSON.stringify(note)
      })
      if (response.status !== 200){
        throw new Error(
          `unexpected response ${response.status} when creating note`
        )
      }
  
      return (await response.json()) as Note
  }

    public static async createPackage(pbcPackage: Shipment): Promise<Shipment> {
      const response = await fetch(this.URI_CREATE_PACKAGE, {
        ...METHOD_POST,
        headers: { ...CONTENT_TYPE_JSON },
        body: JSON.stringify(pbcPackage)
      })
  
      if (response.status !== 200) {
        throw new Error(
          `unexpected response ${response.status} when creating package: ${JSON.stringify(
            pbcPackage
          )}`
        )
      }
  
      return (await response.json()) as Shipment
    }

    public static async updatePackage(pbcPackage: Shipment): Promise<Shipment> {
      let shipment = removeExistsInDatabaseTag(pbcPackage)
      const response = await fetch(this.URI_UPDATE_PACKAGE, {
        ...METHOD_PUT,
        headers: { ...CONTENT_TYPE_JSON },
        body: JSON.stringify(shipment)
      })
  
      if (response.status !== 200) {
        throw new Error(
          `unexpected response ${response.status} when updating package at "${
            this.URI_UPDATE_PACKAGE
          }" with details: ${JSON.stringify(shipment)}`
        )
      }
  
      return (await response.json()) as Shipment
    }
}

const packageSortByDate = (packageA: Package, packageB: Package) => {
  const [dateA, dateB] = [new Date(packageA.date), new Date(packageB.date)]
  if (dateA === dateB) return 0
  return dateA > dateB ? -1 : 1
}

