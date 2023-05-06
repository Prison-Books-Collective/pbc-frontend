import { createURI } from '.'

import { HTTP_GET, HTTP_POST, HTTP_PUT, HTTP_DELETE, WebClient } from '$util/web'
import type { EndpointMap } from '$util/web'
import type { Note, Shipment } from '$models/pbc/shipment'

export const ShipmentClientEndpoints = Object.freeze({
  GET_SHIPMENT: {
    method: HTTP_GET,
    uri: ({ id }) => createURI('getShipment', { id }),
  },
  CREATE_SHIPMENT: {
    method: HTTP_POST,
    uri: () => createURI('addShipment'),
  },
  UPDATE_SHIPMENT: {
    method: HTTP_PUT,
    uri: () => createURI('updateShipment'),
  },
  DELETE_PACKAGE: {
    method: HTTP_DELETE,
    uri: ({ packageId }) => createURI('deleteShipment', { packageId }),
  },

  CREATE_NOTE: {
    method: HTTP_POST,
    uri: () => createURI('addNote'),
  },
  GET_SHIPMENTS_BY_DATE_RANGE: {
    method: HTTP_GET,
    uri: ({ startDate, endDate }) => createURI('getShipmentsBetweenDates', { startDate, endDate }),
  },
  GET_SHIPMENTS_BY_DATE: {
    method: HTTP_GET,
    uri: ({ date }) => createURI('getShipmentsByDate', { date }),
  },
}) satisfies EndpointMap

export class ShipmentClient extends WebClient<typeof ShipmentClientEndpoints> {
  constructor() {
    super('ShipmentClient', ShipmentClientEndpoints)
  }

  public async getShipmentById(id: string): Promise<Shipment | null> {
    return this.fetch<never, Shipment>(this.endpoints.GET_SHIPMENT, {
      params: { id },
    })
  }

  public async createShipment(newShipment: Omit<Shipment, 'id'>): Promise<Shipment | null> {
    return this.fetch<Omit<Shipment, 'id'>, Shipment>(this.endpoints.CREATE_SHIPMENT, {
      body: newShipment,
    })
  }

  public async updateShipment(updatedShipment: Partial<Shipment>): Promise<Shipment | null> {
    return this.fetch<Partial<Shipment>, Shipment>(this.endpoints.UPDATE_SHIPMENT, {
      body: updatedShipment,
    })
  }

  public async deleteShipment(packageId: string): Promise<boolean> {
    const deletion = await this.fetch<never, unknown>(this.endpoints.DELETE_PACKAGE, {
      params: { packageId },
    })
    return !!deletion
  }

  public async createNote(content: string): Promise<Note | null> {
    return this.fetch<Partial<Note>, Note>(this.endpoints.CREATE_NOTE, {
      body: { content },
    })
  }

  public async getShipmentsForDateRange(startDate: string, endDate: string): Promise<Shipment[]> {
    this.throwError({
      httpStatus: 0,
      httpMethod: HTTP_GET,
      httpEndpoint: this.endpoints.GET_SHIPMENTS_BY_DATE_RANGE.uri({ startDate, endDate }),
      message: 'this method is not yet implemented in the bellbooks backend',
    })
    return this.alwaysFetch<never, Shipment[]>(this.endpoints.GET_SHIPMENTS_BY_DATE_RANGE, [], {
      params: { startDate, endDate },
    })
  }

  public async getShipmentsForDate(date: string): Promise<Shipment[]> {
    return this.alwaysFetch<never, Shipment[]>(this.endpoints.GET_SHIPMENTS_BY_DATE, [], {
      params: { date },
    })
  }
}

export const shipmentClient = new ShipmentClient()
