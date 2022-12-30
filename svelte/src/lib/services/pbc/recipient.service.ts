import { BASE_PBC_URI } from '.'
// import type { Facility } from '$models/pbc/facility'
import type { Recipient } from '$models/pbc/recipient'
import { METHOD_GET, METHOD_POST, METHOD_PUT, uriQueryJoin } from '$util/web'

export class RecipientService {

    public static readonly URI_GET_RECIPIENT_BY_ASSIGNED_ID = ( assignedId: string ) =>
        `${BASE_PBC_URI}/getRecipientByAssignedId${uriQueryJoin({ assignedId })}`

//   public static readonly URI_GET_INMATE = (inmateId: string) =>
//     `${BASE_PBC_URI}/getInmate${uriQueryJoin({ id: inmateId })}`
//   public static readonly URI_GET_INMATE__NO_ID__BY_DATABASE_ID = (databaseId: string | number) =>
//     `${BASE_PBC_URI}/getInmateNoIDByDatabaseID${uriQueryJoin({ id: databaseId })}`
//   public static readonly URI_GET_INMATE__BY_NAME = ({ firstName, lastName }) =>
//     `${BASE_PBC_URI}/searchInmatesByName${uriQueryJoin({ firstName, lastName })}`
//   public static readonly URI_GET_INMATE__NO_ID__BY_NAME = ({ firstName, lastName }) =>
//     `${BASE_PBC_URI}/getInmateNoID${uriQueryJoin({ firstName, lastName })}`
//   public static readonly URI_CREATE_INMATE = ({ firstName, lastName, inmateId }) =>
//     `${BASE_PBC_URI}/addInmate${uriQueryJoin({ firstName, lastName, id: inmateId })}`
//   public static readonly URI_CREATE_INMATE__NO_ID = ({ firstName, lastName, location }) =>
//     `${BASE_PBC_URI}/addInmateNoID${uriQueryJoin({ firstName, lastName, location })}`
//   public static readonly URI_UPDATE_INMATE = ({ initialId, firstName, lastName, inmateId }) =>
//     `${BASE_PBC_URI}/updateInmate${uriQueryJoin({
//       originalId: initialId,
//       firstName,
//       lastName,
//       id: inmateId
//     })}`
//   public static readonly URI_UPDATE_INMATE__NO_ID = ({
//     initialId,
//     firstName,
//     lastName,
//     location,
//     inmateId
//   }) =>
//     `${BASE_PBC_URI}/updateInmateNoID${uriQueryJoin({
//       originalId: initialId,
//       firstName,
//       lastName,
//       location,
//       id: inmateId
//     })}`

    public static async getRecipientByAssignedId( assignedId: string ): Promise<Recipient | null> {
        const response = await fetch(this.URI_GET_RECIPIENT_BY_ASSIGNED_ID(assignedId), { ...METHOD_GET })
        if (response.status !== 200) return null
        return await response.json() as Recipient
    }

//   public static async getInmate(inmateId: string): Promise<Inmate | null> {
//     const response = await fetch(this.URI_GET_INMATE(inmateId), { ...METHOD_GET })

//     if (response.status === 204) return null
//     if (response.status !== 200) {
//       throw new Error(
//         `unexpected response ${
//           response.status
//         } when searching for inmate with ID "${inmateId}" at "${this.URI_GET_INMATE(inmateId)}"`
//       )
//     }

//     return (await response.json()) as Inmate
//   }

//   public static async getInmateNoIdByDatabaseID(databaseId: string | number): Promise<Inmate> {
//     const response = await fetch(this.URI_GET_INMATE__NO_ID__BY_DATABASE_ID(databaseId), {
//       ...METHOD_GET
//     })

//     if (response.status !== 200) {
//       throw new Error(
//         `unexpected response ${
//           response.status
//         } when searching for no-ID inmate with database-ID "${databaseId}" at "${this.URI_GET_INMATE__NO_ID__BY_DATABASE_ID(
//           databaseId
//         )}"`
//       )
//     }

//     return (await response.json()) as Inmate
//   }

//   public static async getAllInmatesByName({
//     firstName,
//     lastName
//   }: {
//     firstName: string
//     lastName: string
//   }): Promise<Inmate[]> {
//     const inmatesWithIDs = await this.getInmatesByName({ firstName, lastName })
//     const inmatesWithoutIDs = await this.getInmateNoIdByName({ firstName, lastName })

//     return [...inmatesWithIDs, ...inmatesWithoutIDs]
//   }

//   public static async getInmatesByName({
//     firstName,
//     lastName
//   }: {
//     firstName: string
//     lastName: string
//   }): Promise<Inmate[]> {
//     const response = await fetch(this.URI_GET_INMATE__BY_NAME({ firstName, lastName }), {
//       ...METHOD_GET
//     })

//     if (response.status === 204) return []
//     if (response.status !== 200) {
//       throw new Error(
//         `unexpected response ${
//           response.status
//         } when searching for inmate with name "${firstName} ${lastName}" at "${this.URI_GET_INMATE__BY_NAME(
//           { firstName, lastName }
//         )}"`
//       )
//     }

//     return (await response.json()) as Inmate[]
//   }

//   public static async getInmateNoIdByName({
//     firstName,
//     lastName
//   }: {
//     firstName: string
//     lastName: string
//   }): Promise<Inmate[]> {
//     const response = await fetch(this.URI_GET_INMATE__NO_ID__BY_NAME({ firstName, lastName }), {
//       ...METHOD_GET
//     })

//     if (response.status === 204) return []
//     if (response.status !== 200) {
//       throw new Error(
//         `unexpected response ${
//           response.status
//         } when searching for no-ID inmate with name "${lastName}, ${firstName}" at "${this.URI_GET_INMATE__NO_ID__BY_NAME(
//           { firstName, lastName }
//         )}"`
//       )
//     }

//     return (await response.json()) as Inmate[]
//   }

//   public static async getInmateUnknownIdStatus(id: string | number): Promise<Inmate> {
//     let inmate = await this.getInmate(id.toString())
//     if (!inmate) {
//       inmate = await this.getInmateNoIdByDatabaseID(id)
//     }
//     return inmate
//   }

//   public static async createInmate({
//     firstName,
//     lastName,
//     inmateId
//   }: {
//     firstName: string
//     lastName: string
//     inmateId: string
//   }): Promise<Inmate> {
//     const response = await fetch(this.URI_CREATE_INMATE({ firstName, lastName, inmateId }), {
//       ...METHOD_POST
//     })

//     if (response.status !== 200) {
//       throw new Error(
//         `unexpected response ${response.status} when creating inmate at "${this.URI_CREATE_INMATE({
//           firstName,
//           lastName,
//           inmateId
//         })}" with details: ${JSON.stringify({ firstName, lastName, inmateId })}`
//       )
//     }

//     return (await response.json()) as Inmate
//   }

//   public static async createInmateNoID({
//     firstName,
//     lastName,
//     location
//   }: {
//     firstName: string
//     lastName: string
//     location: Facility
//   }): Promise<Inmate> {
//     const response = await fetch(
//       this.URI_CREATE_INMATE__NO_ID({ firstName, lastName, location: location.facility_name }),
//       { ...METHOD_POST }
//     )

//     if (response.status !== 200) {
//       throw new Error(
//         `unexpected response ${
//           response.status
//         } when creating no-ID inmate at "${this.URI_CREATE_INMATE__NO_ID({
//           firstName,
//           lastName,
//           location: location.facility_name
//         })}" with details: ${JSON.stringify({ firstName, lastName, location })}`
//       )
//     }

//     return (await response.json()) as Inmate
//   }

//   public static async updateInmate({
//     initialId,
//     firstName,
//     lastName,
//     inmateId
//   }: {
//     initialId: string
//     firstName: string
//     lastName: string
//     inmateId: string
//   }): Promise<Inmate> {
//     const response = await fetch(
//       this.URI_UPDATE_INMATE({ initialId, firstName, lastName, inmateId }),
//       { ...METHOD_PUT }
//     )

//     if (response.status !== 200) {
//       throw new Error(
//         `unexpected response ${response.status} when updating inmate at "${this.URI_UPDATE_INMATE({
//           initialId,
//           firstName,
//           lastName,
//           inmateId
//         })}" with details: ${JSON.stringify({ firstName, lastName, inmateId })}`
//       )
//     }

//     return (await response.json()) as Inmate
//   }

//   public static async updateInmateNoID({
//     initialId,
//     firstName,
//     lastName,
//     location,
//     inmateId
//   }: {
//     initialId: string
//     firstName: string
//     lastName: string
//     location: string
//     inmateId: string
//   }): Promise<Inmate> {
//     const response = await fetch(
//       this.URI_UPDATE_INMATE__NO_ID({ initialId, firstName, lastName, location, inmateId }),
//       { ...METHOD_PUT }
//     )

//     if (response.status !== 200) {
//       throw new Error(
//         `unexpected response ${
//           response.status
//         } when updating inmate at "${this.URI_UPDATE_INMATE__NO_ID({
//           initialId,
//           firstName,
//           lastName,
//           location,
//           inmateId
//         })}" with details: ${JSON.stringify({ firstName, lastName, location, inmateId })}`
//       )
//     }

//     return (await response.json()) as Inmate
//   }
}
