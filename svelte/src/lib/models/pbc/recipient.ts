import type { Shipment } from "./shipment"

export interface Recipient {
    id: number // database ID
    assignedId?: string // government-assigned ID

    firstName: string
    lastName: string
    middleName?: string

    shipments: Shipment[]

    facility?: any // TODO

    specialRequests?: any // TODO
}

export const isRecipientNoId = (recipient: Recipient) => {
    return !!!(recipient.assignedId)
  }