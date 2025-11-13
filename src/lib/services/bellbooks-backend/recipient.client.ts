import { createURI } from '.'

import type { Recipient } from '$models/pbc/recipient'
import type { Shipment } from '$models/pbc/shipment'
import type { EndpointMap } from '$util/web'
import { HTTP_GET, HTTP_POST, HTTP_PUT, WebClient } from '$util/web'

export const RecipientClientEndpoints = Object.freeze({
  GET_RECIPIENT_BY_ASSIGNED_ID: {
    method: HTTP_GET,
    uri: ({ assignedId }) => createURI('getRecipientByAssignedId', { assignedId }),
  },

  GET_RECIPIENT_BY_ID: {
    method: HTTP_GET,
    uri: ({ id }) => createURI('getRecipient', { id }),
  },

  GET_RECIPIENT_BY_SHIPMENT_ID: {
    method: HTTP_GET,
    uri: ({ shipmentId }) => createURI('getRecipientByShipmentId', { shipmentId }),
  },

  GET_RECIPIENT_LOCATION: {
    method: HTTP_GET,
    uri: ({ id }) => createURI('getRecipientLocation', { id }),
  },

  GET_RECIPIENT_BY_NAME: {
    method: HTTP_GET,
    uri: ({ firstName, lastName }) => createURI('getRecipients', { firstName, lastName }),
  },

  CREATE_RECIPIENT: {
    method: HTTP_POST,
    uri: () => createURI('addRecipient'),
  },

  UPDATE_RECIPIENT: {
    method: HTTP_PUT,
    uri: () => createURI('updateRecipient'),
  },
}) satisfies EndpointMap

export class RecipientClient extends WebClient<typeof RecipientClientEndpoints> {
  constructor() {
    super('RecipientClient', RecipientClientEndpoints)
  }

  public async getRecipientByAssignedId(assignedId: string): Promise<Recipient | null> {
    const recipient = await this.fetch<never, Recipient>(
      this.endpoints.GET_RECIPIENT_BY_ASSIGNED_ID,
      {
        params: { assignedId },
      },
    )
    if (recipient?.shipments) recipient.shipments = recipient.shipments.sort(lazyShipmentSort)
    return recipient
  }

  public async getRecipientByDatabaseId(id: string): Promise<Recipient | null> {
    const recipient = await this.fetch<never, Recipient>(this.endpoints.GET_RECIPIENT_BY_ID, {
      params: { id },
    })
    if (recipient?.shipments) recipient.shipments = recipient.shipments.sort(lazyShipmentSort)
    return recipient
  }

  public async getRecipientByShipmentId(shipmentId: string): Promise<Recipient | null> {
    return this.fetch<never, Recipient>(this.endpoints.GET_RECIPIENT_BY_SHIPMENT_ID, {
      params: { shipmentId },
    })
  }

  public async getRecipientsByName(firstName: string, lastName: string): Promise<Recipient[]> {
    return this.alwaysFetch<never, Recipient[]>(this.endpoints.GET_RECIPIENT_BY_NAME, [], {
      params: { firstName, lastName },
    })
  }

  public async getRecipientLocation(id: string): Promise<string | null> {
    return this.fetch<never, string>(this.endpoints.GET_RECIPIENT_LOCATION, { params: { id } })
  }

  public async createRecipient(newRecipient: Omit<Recipient, 'id'>): Promise<Recipient | null> {
    return this.fetch<Omit<Recipient, 'id'>, Recipient>(this.endpoints.CREATE_RECIPIENT, {
      body: newRecipient,
    })
  }

  public async updateRecipient(updatedRecipient: Partial<Recipient>): Promise<Recipient | null> {
    return this.fetch<Partial<Recipient>, Recipient>(this.endpoints.UPDATE_RECIPIENT, {
      body: updatedRecipient,
    })
  }
}

export const recipientClient = new RecipientClient()

const lazyShipmentSort = (shipmentA: Shipment, shipmentB: Shipment) => {
  return new Date(shipmentA.date) < new Date(shipmentB.date) ? 1 : -1
}
