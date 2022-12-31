import { BASE_PBC_URI } from '.'
import type { Book, Shipment } from '$models/pbc/shipment'
import { CONTENT_TYPE_JSON, METHOD_GET, METHOD_POST, METHOD_DELETE, METHOD_PUT, uriQueryJoin } from '$util/web'

export class ShipmentService {
    public static readonly URI_GET_SHIPMENT = (shipmentId: number) =>
    `${BASE_PBC_URI}/getShipment${uriQueryJoin({id: shipmentId})}`
}

const packageSortByDate = (packageA: Package, packageB: Package) => {
  const [dateA, dateB] = [new Date(packageA.date), new Date(packageB.date)]
  if (dateA === dateB) return 0
  return dateA > dateB ? -1 : 1
}

