import type { Recipient } from '$models/pbc/recipient'
import type { Book, Note, Shipment, Zine } from '$models/pbc/shipment'
import { shipmentClient } from '$services/bellbooks-backend/shipment.client'
import { loading } from '$stores/loading'
import { AppStore } from '$util/store'
import { recipient } from './recipient.data'

const defaultShipmentList: Shipment[] = []
const defaultShipment: Partial<Shipment> = {
  content: [],
  date: new Date(),
  recipient: recipient.getLatest(),
  notes: [],
}

export class ShipmentListStore extends AppStore<Shipment[]> {
  constructor() {
    super('ShipmentListStore', defaultShipmentList)
    recipient.subscribe((recipient) => {
      if (!recipient || !recipient.id) return
      this.set(recipient.shipments)
    })
  }

  public async fetch({ recipientId }: { recipientId: string }): Promise<Shipment[]> {
    loading.start()
    await recipient.fetch({ id: recipientId })
    loading.end()
    return [...this.getLatest()]
  }

  public async fetchForDate(date: string): Promise<Shipment[]> {
    loading.start()
    const shipments = await shipmentClient.getShipmentsForDate(date)
    loading.end()

    this.set(shipments)
    return shipments
  }

  public async fetchForDateRange(startDate: string, endDate: string): Promise<Shipment[]> {
    loading.start()
    const shipments = await shipmentClient.getShipmentsForDateRange(startDate, endDate)
    loading.end()

    this.set(shipments)
    return shipments
  }

  public async sync(): Promise<Shipment[]> {
    return [...this.getLatest()]
  }

  public load(loadedData: Shipment[]): Shipment[] {
    this.set(loadedData)
    return loadedData
  }

  public localAddShipment(shipment: Shipment): Shipment[] {
    let update: Shipment[]
    this.update((shipments) => {
      update = [...shipments, shipment]
      return update
    })
    return update!
  }

  public localRemoveShipment(id: string): Shipment[] {
    let update: Shipment[]
    this.update((shipments) => {
      update = shipments
      const removeIndex = update.findIndex((s) => s.id.toString() === id.toString())
      if (removeIndex > -1) update.splice(removeIndex, 1)
      return update
    })
    return update!
  }

  public localUpdateShipment(shipmentUpdate: Partial<Shipment>): Shipment[] {
    let update: Shipment[]
    this.update((shipments) => {
      update = shipments
      const updateIndex = update.findIndex((s) => s.id.toString() === shipmentUpdate.id?.toString())
      if (updateIndex > -1) {
        const shipmentToUpdate = update[updateIndex]
        update[updateIndex] = {
          ...shipmentToUpdate,
          ...shipmentUpdate,
        }
      }
      return update
    })
    return update!
  }
}

export class SingleShipmentStore extends AppStore<Shipment> {
  constructor() {
    super('CreateShipmentStore', defaultShipment as any)
  }

  public async fetch({ id }: { id: string }): Promise<Shipment> {
    loading.start()
    const shipment = await shipmentClient.getShipmentById(id)
    loading.end()

    if (shipment) {
      this.set(shipment)
      return shipment
    }
    return this.getLatest()
  }

  public async sync(): Promise<Shipment> {
    const shipmentUpdate = this.getLatest()
    const isUpdate = !!shipmentUpdate.id

    loading.start()
    const newShipment = isUpdate
      ? await shipmentClient.updateShipment(shipmentUpdate)
      : await shipmentClient.createShipment(shipmentUpdate)
    loading.end()

    if (newShipment) {
      this.set(newShipment)
      isUpdate
        ? shipments.localUpdateShipment(newShipment)
        : shipments.localAddShipment(newShipment)
      return newShipment
    }

    return this.getLatest()
  }

  public load(loadedData: Shipment): Shipment {
    this.set(loadedData)
    return loadedData
  }

  public async delete(): Promise<void> {
    const shipment = this.getLatest()

    loading.start()
    shipmentClient.deleteShipment(shipment.id.toString())
    loading.end()
    shipments.localRemoveShipment(shipment.id.toString())
  }

  public addContent(type: 'book' | 'zine', content: Book | Zine) {
    this.update((shipment) => ({
      ...shipment,
      content: [...shipment.content, { ...content, type }],
    }))
  }

  public setRecipient(recipient: Recipient) {
    this.update((shipment) => ({ ...shipment, recipient }))
  }

  public setNote(note: Note) {
    this.update((shipment) => ({ ...shipment, notes: [note] }))
  }

  public setDestination(facility: Facility) {
    this.update((shipment) => ({ ...shipment, facility }))
  }

  public setAlert(content = '') {
    this.update((shipment) => ({ ...shipment, notes: [{ id: null, content }] }))
  }

  public removeItemsById(...ids: (string | number)[]) {
    this.update((shipment) => {
      let { content } = shipment

      ids.forEach((id) => (content = content.filter((c) => c.id.toString() != id.toString())))

      return {
        ...shipment,
        content,
      }
    })
  }
}

export const shipments = new ShipmentListStore()
export const createShipment = new SingleShipmentStore()
