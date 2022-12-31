import { BASE_PBC_URI } from '.'
// import type { Facility } from '$models/pbc/facility'
import type { Recipient } from '$models/pbc/recipient'
import { METHOD_GET, METHOD_POST, METHOD_PUT, uriQueryJoin } from '$util/web'

export class RecipientService {

    public static readonly URI_GET_RECIPIENT_BY_ASSIGNED_ID = ( assignedId: string ) =>
        `${BASE_PBC_URI}/getRecipientByAssignedId${uriQueryJoin({ assignedId })}`

    public static async getRecipientByAssignedId( assignedId: string ): Promise<Recipient | null> {
        const response = await fetch(this.URI_GET_RECIPIENT_BY_ASSIGNED_ID(assignedId), { ...METHOD_GET })
        if (response.status !== 200) return null
        return await response.json() as Recipient
    }
}
