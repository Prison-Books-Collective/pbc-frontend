import type { NewZine } from '$models/pbc/newZine'
import type { Zine } from '$models/pbc/shipment'
import {
  CONTENT_TYPE_JSON,
  METHOD_DELETE,
  METHOD_GET,
  METHOD_POST,
  METHOD_PUT,
  uriQueryJoin,
} from '$util/web'
import { BASE_PBC_URI } from '.'

export class ZineService {
  public static readonly URI_GET_ZINES = `${BASE_PBC_URI}/getAllZines`
  public static readonly URI_CREATE_ZINE = `${BASE_PBC_URI}/addContent`
  public static readonly URI_UPDATE_ZINE = `${BASE_PBC_URI}/updateContent`
  public static readonly URI_DELETE_ZINE = (id: number) =>
    `${BASE_PBC_URI}/deleteContent${uriQueryJoin({ id })}`
  public static readonly URI_GET_ZINE_BY_CODE = (code: string) =>
    `${BASE_PBC_URI}/getZineByCode?code=${code}`

  private static cachedZines: Zine[] = []

  public static async deleteZine(zine: Zine): Promise<void> {
    const response = await fetch(this.URI_DELETE_ZINE(zine.id), {
      ...METHOD_DELETE,
    })

    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${response.status} when deleting zine with ID "${
          zine.id ?? 'no id provided'
        }" at ${this.URI_DELETE_ZINE(zine.id)}`,
      )
    }

    this.cachedZines = this.cachedZines.filter((z) => z.id != zine.id)
  }

  public static async updateZine(zine: Zine): Promise<Zine> {
    const response = await fetch(this.URI_UPDATE_ZINE, {
      ...METHOD_PUT,
      headers: { ...CONTENT_TYPE_JSON },
      body: JSON.stringify({ ...zine, type: 'zine' }),
    })

    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${response.status} when updating zine with ID "${
          zine.id ?? 'no id provided'
        }" at ${this.URI_UPDATE_ZINE} with details: ${JSON.stringify(zine)}`,
      )
    }

    const updatedZine: Zine = await response.json()
    if (this.cachedZines.length > 0) {
      this.cachedZines = this.cachedZines
        .map((zine) => {
          if (zine.id !== updatedZine.id) return zine
          return { ...updatedZine }
        })
        .sort(zineSortAlphabetical)
    }

    return updatedZine
  }

  public static async createZine(zine: Omit<Omit<Zine, 'id'>, 'type'>): Promise<Zine> {
    const response = await fetch(this.URI_CREATE_ZINE, {
      ...METHOD_POST,
      headers: { ...CONTENT_TYPE_JSON },
      body: JSON.stringify({ ...zine, type: 'zine' }),
    })

    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${response.status} when creating zine at ${
          this.URI_CREATE_ZINE
        } with details: ${JSON.stringify(zine)}`,
      )
    }

    const createdZine: Zine = await response.json()
    if (this.cachedZines.length > 0) {
      this.cachedZines = [createdZine, ...this.cachedZines].sort(zineSortAlphabetical)
    }

    return createdZine
  }

  public static async getZineByCode(code: string): Promise<NewZine> {
    const response = await fetch(this.URI_GET_ZINE_BY_CODE(code), { ...METHOD_GET })
    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${response.status} when retrieving all zines from ${this.URI_GET_ZINES}`,
      )
    }
    return await response.json()
  }

  public static async getZines(): Promise<Zine[]> {
    if (this.cachedZines.length > 0) {
      return this.cachedZines
    }

    const response = await fetch(this.URI_GET_ZINES, { ...METHOD_GET })
    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${response.status} when retrieving all zines from ${this.URI_GET_ZINES}`,
      )
    }

    const zines = await response.json()
    zines.forEach((z) => {
      z.type = 'zine'
    })
    this.cachedZines = zines.sort(zineSortAlphabetical)
    return this.cachedZines
  }
}

const zineSortAlphabetical = (zineA: Zine, zineB: Zine) => zineA.code.localeCompare(zineB.code)
