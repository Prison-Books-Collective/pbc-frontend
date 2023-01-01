import { BASE_PBC_URI } from '.'
import type { Book, Shipment } from '$models/pbc/shipment'
import { CONTENT_TYPE_JSON, METHOD_GET, METHOD_POST, METHOD_DELETE, METHOD_PUT, uriQueryJoin } from '$util/web'

export class ShipmentService {
    public static readonly URI_GET_SHIPMENT = (shipmentId: number) =>
    `${BASE_PBC_URI}/getShipment${uriQueryJoin({id: shipmentId})}`
    public static readonly URI_CREATE_PACKAGE = `${BASE_PBC_URI}/addShipment`

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
}

const packageSortByDate = (packageA: Package, packageB: Package) => {
  const [dateA, dateB] = [new Date(packageA.date), new Date(packageB.date)]
  if (dateA === dateB) return 0
  return dateA > dateB ? -1 : 1
}

