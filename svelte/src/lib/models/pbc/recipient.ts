export interface Recipient {
    id: number // database ID
    assignedId?: string // government-assigned ID

    firstName: string
    lastName: string
    middleName?: string

    facility?: any // TODO
    shipments?: any // TODO
    specialRequests?: any // TODO
}
