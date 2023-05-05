import { BASE_PBC_URI } from '.'
import { CONTENT_TYPE_JSON, METHOD_GET, METHOD_POST } from '$util/web'
import type { Zine } from '$models/pbc/shipment'
import type { NewZine } from '$models/pbc/newZine'

export class ZineService {
  public static readonly URI_GET_ZINES = `${BASE_PBC_URI}/getAllZines`
  public static readonly URI_CREATE_ZINE = `${BASE_PBC_URI}/addContent`
  public static readonly URI_GET_ZINE_BY_CODE = (code: string) =>
    `${BASE_PBC_URI}/getZineByCode?code=${code}`

  private static cachedZines: Zine[] = []

  public static async createZine(zine: Zine): Promise<Zine> {
    const response = await fetch(this.URI_CREATE_ZINE, {
      ...METHOD_POST,
      headers: { ...CONTENT_TYPE_JSON },
      body: JSON.stringify(zine)
    })

    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${response.status} when creating zine at ${
          this.URI_CREATE_ZINE
        } with details: ${JSON.stringify(zine)}`
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
        `unexpected response ${response.status} when retrieving all zines from ${this.URI_GET_ZINES}`
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
        `unexpected response ${response.status} when retrieving all zines from ${this.URI_GET_ZINES}`
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
