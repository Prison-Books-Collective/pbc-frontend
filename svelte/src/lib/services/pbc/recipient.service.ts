import { BASE_PBC_URI } from '.'
// import type { Facility } from '$models/pbc/facility'
import type { Recipient } from '$models/pbc/recipient'
import { CONTENT_TYPE_JSON, METHOD_GET, METHOD_POST, METHOD_PUT, uriQueryJoin } from '$util/web'

export class RecipientService {
  
    public static readonly URI_GET_RECIPIENT_BY_ASSIGNED_ID = ( assignedId: string ) =>
        `${BASE_PBC_URI}/getRecipientByAssignedId${uriQueryJoin({ assignedId })}`

        public static readonly URI_GET_RECIPIENT_BY_ID = ( id: string ) =>
        `${BASE_PBC_URI}/getRecipient${uriQueryJoin({ id })}`


        public static readonly URI_GET_RECIPIENT__BY_NAME = ({ firstName, lastName }) =>
    `${BASE_PBC_URI}/getRecipients?firstName=${firstName}&lastName=${lastName}`

        public static readonly URI_CREATE_INMATE = () => `${BASE_PBC_URI}/addRecipient`

    public static async getRecipientByAssignedId( assignedId: string ): Promise<Recipient | null> {
      navigator.clipboard.writeText(assignedId)
     
        const response = await fetch(this.URI_GET_RECIPIENT_BY_ASSIGNED_ID(assignedId), { ...METHOD_GET })
        if (response.status !== 200) return null
        return await response.json() as Recipient
    }

    public static async getRecipientByDatabaseId( id: string ): Promise<Recipient | null> {
      const response = await fetch(this.URI_GET_RECIPIENT_BY_ID(id), { ...METHOD_GET })
      if (response.status !== 200) return null
      return await response.json() as Recipient
  }

    public static async createRecipient({
        firstName,
        lastName,
        assignedId
      }: {
        firstName: string
        lastName: string
        assignedId: string
      }): Promise<Recipient> {
        const response = await fetch(this.URI_CREATE_INMATE(), {
          ...METHOD_POST, headers: { ...CONTENT_TYPE_JSON },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            assignedId: assignedId
          })
        })
    
        if (response.status !== 200) {
          throw new Error(
            `unexpected response ${response.status} when creating inmate at "${this.URI_CREATE_INMATE()}" with details: ${JSON.stringify({ firstName, lastName, assignedId })}`
          )
        }
    
        return (await response.json()) as Recipient
      }



      public static async getRecipientsByName({
        firstName,
        lastName
      }: {
        firstName: string
        lastName: string
      }): Promise<Recipient[]> {
        if (firstName == null || firstName =="-"){
          firstName = ""
        } 

        if (lastName == null || lastName=="-") {
          lastName = ""
        }
        
        const response = await fetch(this.URI_GET_RECIPIENT__BY_NAME({ firstName, lastName }), {
          ...METHOD_GET
        })
    
        if (response.status === 204) return []
        if (response.status !== 200) {
          throw new Error(
            `unexpected response ${
              response.status
            } when searching for recipient with name "${firstName} ${lastName}" at "${this.URI_GET_RECIPIENT__BY_NAME(
              { firstName, lastName }
            )}"`
          )
        }
    
        return (await response.json()) as Recipient[]
      }
    
    
}