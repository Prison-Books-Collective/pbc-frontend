import {
  writable,
  type Subscriber,
  type Unsubscriber,
  type Updater,
  type Writable
} from 'svelte/store'
import type { Book } from '$models/pbc/book'
import type { Facility } from '$models/pbc/facility'
import { isInmateNoID, type Inmate } from '$models/pbc/inmate'
import type { Package } from '$models/pbc/package'
import type { Zine } from '$models/pbc/zine'
import { isNoISBNBook } from '$services/pbc/book.service'
import { PackageService } from '$services/pbc/package.service'
import { focusedInmate, type FocusedInmateStore } from '$stores/inmate'
import { formatDate } from '$util/time'

interface LocalStoragePackage extends Package {
  existsInDatabase?: boolean
}

export class FocusedPackagesStore implements Writable<LocalStoragePackage[]> {
  private readonly focusedInmateStore: FocusedInmateStore

  constructor(focusedInmateStore: FocusedInmateStore) {
    const { set, update, subscribe } = writable([])

    this.set = set
    this.update = update
    this.subscribe = subscribe

    this.focusedInmateStore = focusedInmateStore

    focusedInmateStore.subscribe(async ($recipient) => {
      if (!$recipient || !$recipient.id) return
      // const shipments = await PackageService.TODO_getPackagesForRecipient($recipient.id)
      this.set($recipient.shipments) // TODO: may prevent reloading when new packages are added
      // const packages = await (isInmateNoID($recipient)
      //   ? PackageService.getPackagesForInmateNoID($recipient.id)
      //   : PackageService.getPackagesForInmate($recipient.id))
      // this.set(packages)
    })
  }

  public set: (this: void, value: LocalStoragePackage[]) => void
  public update: (this: void, updater: Updater<LocalStoragePackage[]>) => void
  public subscribe: (
    this: void,
    run: Subscriber<LocalStoragePackage[]>,
    invalidate?: (value?: LocalStoragePackage[]) => void
  ) => Unsubscriber

  public async fetchForInmate(inmateID: string): Promise<void> {
    // triggers the subscription that's set up in the constructor
    await this.focusedInmateStore.fetch(inmateID)
  }

  public async fetchForDate(date: string): Promise<LocalStoragePackage[]> {
    try {
      const packages = await PackageService.getPackagesForDate(date)
      this.set(packages)
      return packages
    } catch (error) {
      console.error(error)
      console.error(`failed to retrieve packages for Date "${date}" via remote`)
      this.set([])
      return []
    }
  }

  public async fetchForDateRange(
    startDate: string,
    endDate: string
  ): Promise<LocalStoragePackage[]> {
    try {
      const packages = await PackageService.getPackagesForDateRange(startDate, endDate)
      this.set(packages)
      return packages
    } catch (error) {
      console.error(error)
      console.error(
        `failed to retrieve packages for date range "${startDate}, ${endDate}" via remote`
      )
      this.set([])
      return []
    }
  }

  public async fetchForISBN(isbn: string): Promise<LocalStoragePackage[]> {
    try {
      const packages = await PackageService.getPackagesForISBN(isbn)
      this.set(packages)
      return packages
    } catch (error) {
      console.error(error)
      console.error(`failed to retrieve packages containing ISBN "${isbn}" via remote`)
      this.set([])
      return []
    }
  }

  public async fetchForAuthorAndTitle(
    author: string,
    title: string
  ): Promise<LocalStoragePackage[]> {
    try {
      const packages = await PackageService.getPackagesForAuthorAndTitle(author, title)
      this.set(packages)
      return packages
    } catch (error) {
      console.error(error)
      console.error(
        `failed to retrieve packages containing book with title "${title}" by author "${author}" via remote`
      )
      this.set([])
      return []
    }
  }

  public localRemovePackage(packageID: number): LocalStoragePackage[] {
    let updatedPackages: LocalStoragePackage[]
    this.update((packages) => {
      updatedPackages = packages
      const removeIndex = updatedPackages.findIndex((p) => p.id === packageID)
      if (removeIndex > -1) {
        updatedPackages.splice(removeIndex, 1)
      }
      return updatedPackages
    })
    return updatedPackages
  }

  // packageUpdates MUST contain the package ID that's being updated
  public localUpdatePackage(packageUpdates: Partial<LocalStoragePackage>): LocalStoragePackage[] {
    let updatedPackages: LocalStoragePackage[]
    this.update((packages) => {
      updatedPackages = packages
      const updateIndex = updatedPackages.findIndex((p) => p.id === packageUpdates.id)
      if (updateIndex > -1) {
        const packageToUpdate = updatedPackages[updateIndex]
        updatedPackages[updateIndex] = {
          ...packageToUpdate,
          ...packageUpdates
        }
      }
      return updatedPackages
    })

    return updatedPackages
  }

  public localAddPackage(pbcPackage: LocalStoragePackage): LocalStoragePackage[] {
    let updatedPackages: LocalStoragePackage[]
    this.update((packages) => {
      updatedPackages = [pbcPackage, ...packages]
      return updatedPackages
    })
    return updatedPackages
  }
}

export class FocusedPackageStore implements Writable<LocalStoragePackage> {
  private readonly defaultPackage: LocalStoragePackage
  private readonly packagesStore: FocusedPackagesStore
  private currentValue: Promise<LocalStoragePackage> = new Promise(() => null)

  constructor(defaultPackage: LocalStoragePackage, packagesStore: FocusedPackagesStore) {
    const { set, update, subscribe } = writable(defaultPackage)

    this.set = set
    this.update = update
    this.subscribe = subscribe

    this.defaultPackage = Object.freeze(defaultPackage)
    this.packagesStore = packagesStore

    this.subscribe((currentValue) => (this.currentValue = Promise.resolve(currentValue)))
  }

  public set: (this: void, value: LocalStoragePackage) => void
  public update: (this: void, updater: Updater<LocalStoragePackage>) => void
  public subscribe: (
    this: void,
    run: Subscriber<LocalStoragePackage>,
    invalidate?: (value?: LocalStoragePackage) => void
  ) => Unsubscriber
  public async get(): Promise<LocalStoragePackage> {
    return await this.currentValue
  }

  public async fetch(packageId: number): Promise<LocalStoragePackage> {
    try {
      const pbcPackage = await PackageService.getPackage(packageId)
      this.load(pbcPackage)
      return pbcPackage
    } catch (error) {
      console.error(error)
      console.error(`failed to retrieve package with ID "${packageId}" via remote`)
      this.load(this.defaultPackage)
      return this.defaultPackage
    }
  }

  public async sync(): Promise<LocalStoragePackage> {
    const pbcPackage = await this.get()
    const createdPackage = pbcPackage.id
      ? await PackageService.updatePackage(pbcPackage)
      : await PackageService.createPackage(pbcPackage)

    pbcPackage.id
      ? this.packagesStore.localUpdatePackage(createdPackage)
      : this.packagesStore.localAddPackage(createdPackage)

    this.load(createdPackage)
    return createdPackage
  }

  public async delete(): Promise<void> {
    const pbcPackage = await this.get()
    await PackageService.deletePackage(pbcPackage.id)
    this.packagesStore.localRemovePackage(pbcPackage.id)
    this.reset()
  }

  public load(pbcPackage: Package) {
    this.set({ ...pbcPackage, existsInDatabase: true })
  }

  public reset() {
    this.set({ ...this.defaultPackage })
  }

  public addBook(book: Book) {
    if (isNoISBNBook(book)) {
      this.update((currentPackage) => ({
        ...currentPackage,
        noISBNBooks: [...currentPackage.noISBNBooks, book]
      }))
    } else {
      this.update((currentPackage) => ({
        ...currentPackage,
        books: [...currentPackage.books, book]
      }))
    }
  }

  public addZine(zine: Zine) {
    this.update((currentPackage) => ({
      ...currentPackage,
      zines: [...currentPackage.zines, zine]
    }))
  }

  public setInmate(inmate: Inmate) {
    if (isInmateNoID(inmate)) {
      this.update((currentPackage) => ({
        ...currentPackage,
        inmate: null,
        inmateNoId: inmate as Inmate
      }))
    } else {
      this.update((currentPackage) => ({
        ...currentPackage,
        inmateNoId: null,
        inmate: inmate as Inmate
      }))
    }
  }

  public createAlert(alertText = '') {
    this.update((currentPackage) => ({
      ...currentPackage,
      alert: {
        id: null,
        information: alertText
      }
    }))
  }

  public setDestination(facility: Facility) {
    this.update((currentPackage) => ({
      ...currentPackage,
      facility
    }))
  }

  public removeItemsById(...ids: (string | number)[]) {
    this.update((currentPackage) => {
      let { books, noISBNBooks, zines } = currentPackage

      ids.forEach((id) => {
        books = books.filter((b) => b.id != id)
        noISBNBooks = noISBNBooks.filter((b) => b.id != id)
        zines = zines.filter((z) => z.id != id)
      })

      return {
        ...currentPackage,
        books,
        noISBNBooks,
        zines
      }
    })
  }
}

const emptyPackage: LocalStoragePackage = {
  id: null,
  date: formatDate(new Date()),

  inmate: null,
  inmateNoId: null,
  facility: null,

  books: [],
  zines: [],
  noISBNBooks: [],

  alert: null,

  existsInDatabase: false
}

export const focusedPackages = new FocusedPackagesStore(focusedInmate)
export const focusedPackage = new FocusedPackageStore(emptyPackage, focusedPackages)
