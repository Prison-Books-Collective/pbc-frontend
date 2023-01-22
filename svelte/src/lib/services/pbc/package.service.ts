import { BASE_PBC_URI } from '.'
import type { Package } from '$models/pbc/package'
import { CONTENT_TYPE_JSON, METHOD_GET, METHOD_POST, METHOD_DELETE, METHOD_PUT, uriQueryJoin } from '$util/web'
import type { Shipment } from '$models/pbc/shipment'

export class PackageService {
  public static readonly URI_GET_PACKAGE = (packageId: number) =>
    `${BASE_PBC_URI}/getShipment?id=${packageId}`
  public static readonly URI_GET_PACKAGES_FOR_RECIPIENT_BY_DB_ID = (id: string) =>
    `${BASE_PBC_URI}/getAllShipmentsByRecipient${uriQueryJoin({ id })}`
  public static readonly URI_GET_PACKAGES = (inmateId: string) =>
    `${BASE_PBC_URI}/getPackagesForInmate?inmateId=${inmateId}`
  public static readonly URI_GET_PACKAGES__INMATE_NO_ID = (database_id: string | number) =>
    `${BASE_PBC_URI}/getPackagesForInmateNoId?inmateId=${database_id}`
  public static readonly URI_CREATE_PACKAGE = `${BASE_PBC_URI}/addPackage`
  public static readonly URI_CREATE_PACKAGE__INMATE_NO_ID = (inmateDatabaseID) =>
    `${BASE_PBC_URI}/addPackageForInmateNoId?id=${inmateDatabaseID}`
  public static readonly URI_UPDATE_PACKAGE = `${BASE_PBC_URI}/updateShipment`
  public static readonly URI_DELETE_PACKAGE = (packageId: number) =>
    `${BASE_PBC_URI}/deleteShipment?id=${packageId}`
  public static readonly URI_PACKAGE_COUNT = (date: string) =>
    `${BASE_PBC_URI}/getPackageCountFromDate?date=${date}` // date is a formatted string "yyyy-mm-dd"
  public static readonly URI_GET_PACKAGES__BY_DATE = (date: string) =>
    `${BASE_PBC_URI}/getPackagesFromDate?date=${date}`
  public static readonly URI_GET_PACKAGES__BY_DATE_RANGE = (startDate: string, endDate: string) =>
    `${BASE_PBC_URI}/getPackagesBetweenDates?startDate=${startDate}&endDate=${endDate}`
  public static readonly URI_GET_PACKAGES__BY_ISBN = (isbn: string) =>
    `${BASE_PBC_URI}/getPackagesByISBN?isbn=${isbn}`
  public static readonly URI_GET_PACKAGES__BY_AUTHOR_AND_TITLE = (author: string, title: string) =>
    `${BASE_PBC_URI}/getPackagesByAuthorAndTitle?author=${author}&title=${title}`

  public static async TODO_getPackagesForRecipient(assignedId: string): Promise<Shipment[]> {
    const response = await fetch(this.URI_GET_PACKAGES_FOR_RECIPIENT_BY_DB_ID(assignedId), { ...METHOD_GET })

    if( response.status !== 200 ) {
      throw new Error(
        `unexpected response ${
          response.status
        } when retrieving package for recipient with assigned ID "${assignedId}" at "${this.URI_GET_PACKAGES_FOR_RECIPIENT_BY_DB_ID(assignedId)}"`
      )
    }

    return await response.json()
  }

  public static async getPackage(packageId: number): Promise<Shipment> {
    const response = await fetch(this.URI_GET_PACKAGE(packageId), { ...METHOD_GET })

    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${
          response.status
        } when retrieving package with ID "${packageId}" at "${this.URI_GET_PACKAGE(packageId)}"`
      )
    }

    return (await response.json()) as Shipment
  }

  public static async createPackage(pbcPackage: Package): Promise<Package> {
    
    const response = await fetch(this.URI_CREATE_PACKAGE, {
      ...METHOD_POST,
      headers: { ...CONTENT_TYPE_JSON },
      body: JSON.stringify(pbcPackage)
    })

    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${response.status} when creating package: ${JSON.stringify(
          pbcPackage
        )}`
      )
    }

    return (await response.json()) as Package
  }

  // returns true when successfully deleted; otherwise throws an error
  public static async deletePackage(packageId: number): Promise<boolean> {
    const response = await fetch(this.URI_DELETE_PACKAGE(packageId), { ...METHOD_DELETE })

    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${
          response.status
        } when deleting package with ID ${packageId} from ${this.URI_DELETE_PACKAGE(packageId)}`
      )
    }

    return true
  }

  public static async updatePackage(pbcPackage: Shipment): Promise<Shipment> {
    const response = await fetch(this.URI_UPDATE_PACKAGE, {
      ...METHOD_PUT,
      headers: { ...CONTENT_TYPE_JSON },
      body: JSON.stringify(pbcPackage)
    })

    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${response.status} when updating package at "${
          this.URI_UPDATE_PACKAGE
        }" with details: ${JSON.stringify(pbcPackage)}`
      )
    }

    return (await response.json()) as Shipment
  }

  public static async getPackagesForInmate(inmateId: string): Promise<Package[]> {
    const response = await fetch(this.URI_GET_PACKAGES(inmateId), { ...METHOD_GET })

    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${response.status} when retrieving packages for inmate with ID "${inmateId}" at "${this.URI_GET_PACKAGES}"`
      )
    }

    return (await response.json()).reverse() as Package[]
  }

  public static async getPackagesForInmateNoID(databaseId: string): Promise<Package[]> {
    const response = await fetch(this.URI_GET_PACKAGES__INMATE_NO_ID(databaseId), {
      ...METHOD_GET
    })

    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${response.status} when retrieving packages for no-ID inmate with databaseID "${databaseId}" at "${this.URI_GET_PACKAGES__INMATE_NO_ID}"`
      )
    }

    return (await response.json()).reverse() as Package[]
  }

  // date is a formatted string "yyyy-mm-dd"
  public static async getPackageCount(date: string): Promise<number> {
    const response = await fetch(this.URI_PACKAGE_COUNT(date), {
      ...METHOD_GET
    })
    return (await response.json()) as number
  }

  public static async getPackagesForDate(date: string): Promise<Shipment[]> {
    const response = await fetch(this.URI_GET_PACKAGES__BY_DATE(date), {
      ...METHOD_GET
    })

    if (response.status === 204) return []
    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${
          response.status
        } when retrieving packages by date using input "${date}" at "${this.URI_GET_PACKAGES__BY_DATE(
          date
        )}"`
      )
    }

    return ((await response.json()) as Shipment[]).sort(packageSortByDate)
  }

  public static async getPackagesForDateRange(
    startDate: string,
    endDate: string
  ): Promise<Package[]> {
    const response = await fetch(this.URI_GET_PACKAGES__BY_DATE_RANGE(startDate, endDate), {
      ...METHOD_GET
    })

    if (response.status === 204) return []
    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${
          response.status
        } when retrieving packages by date range using input "${startDate}, ${endDate}" at "${this.URI_GET_PACKAGES__BY_DATE_RANGE(
          startDate,
          endDate
        )}"`
      )
    }

    return ((await response.json()) as Package[]).sort(packageSortByDate)
  }

  public static async getPackagesForISBN(isbn: string): Promise<Package[]> {
    const response = await fetch(this.URI_GET_PACKAGES__BY_ISBN(isbn), {
      ...METHOD_GET
    })

    if (response.status === 204) return []
    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${
          response.status
        } when retrieving packages containing isbn using input "${isbn}" at "${this.URI_GET_PACKAGES__BY_ISBN(
          isbn
        )}"`
      )
    }

    return ((await response.json()) as Package[]).sort(packageSortByDate)
  }

  public static async getPackagesForAuthorAndTitle(
    author: string,
    title: string
  ): Promise<Package[]> {
    const response = await fetch(this.URI_GET_PACKAGES__BY_AUTHOR_AND_TITLE(author, title), {
      ...METHOD_GET
    })

    if (response.status === 204) return []
    if (response.status !== 200) {
      throw new Error(
        `unexpected response ${
          response.status
        } when retrieving packages containing "${title}" by author "${author}" at "${this.URI_GET_PACKAGES__BY_AUTHOR_AND_TITLE(
          author,
          title
        )}"`
      )
    }

    return ((await response.json()) as Package[]).sort(packageSortByDate)
  }
}

const packageSortByDate = (packageA: Package, packageB: Package) => {
  const [dateA, dateB] = [new Date(packageA.date), new Date(packageB.date)]
  if (dateA === dateB) return 0
  return dateA > dateB ? -1 : 1
}
