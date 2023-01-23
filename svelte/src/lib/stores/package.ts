import {
  writable,
  type Subscriber,
  type Unsubscriber,
  type Updater,
  type Writable
} from 'svelte/store'
import type { Book, Note, Shipment, Zine } from '$models/pbc/shipment'
import type { Facility } from '$models/pbc/facility'
import { PackageService } from '$services/pbc/package.service'
import { focusedInmate, type FocusedInmateStore } from '$stores/inmate'
import { formatDate } from '$util/time'
import { ShipmentService } from '$services/pbc/shipment.service'
import type { Recipient } from '$models/pbc/recipient'
import { RecipientService } from '$services/pbc/recipient.service'

interface LocalStorageShipment extends Shipment {
  existsInDatabase?: boolean
}

export class FocusedShipmentsStore implements Writable<LocalStorageShipment[]> {
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

  public set: (this: void, value: LocalStorageShipment[]) => void
  public update: (this: void, updater: Updater<LocalStorageShipment[]>) => void
  public subscribe: (
    this: void,
    run: Subscriber<LocalStorageShipment[]>,
    invalidate?: (value?: LocalStorageShipment[]) => void
  ) => Unsubscriber

  public async fetchForInmate(inmateID: string): Promise<void> {
    // triggers the subscription that's set up in the constructor
    await this.focusedInmateStore.fetch(inmateID)
  }

  public async fetchForDate(date: string): Promise<Loc[]> {
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
  public localUpdatePackage(packageUpdates: Partial<LocalStorageShipment>): LocalStorageShipment[] {
    let updatedPackages: LocalStorageShipment[]
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

  public localAddPackage(pbcPackage: LocalStorageShipment): LocalStorageShipment[] {
    let updatedPackages: LocalStorageShipment[]

    this.update((packages) => {
      updatedPackages = [pbcPackage, ...packages]
      return updatedPackages
    })
    return updatedPackages
  }


}

export class FocusedShipmentStore implements Writable<LocalStorageShipment> {
  private readonly defaultPackage: LocalStorageShipment
  private readonly packagesStore: FocusedShipmentsStore
  private currentValue: Promise<LocalStorageShipment> = new Promise(() => null)

  constructor(defaultPackage: LocalStorageShipment, packagesStore: FocusedShipmentsStore) {
    const { set, update, subscribe } = writable(defaultPackage)

    this.set = set
    this.update = update
    this.subscribe = subscribe

    this.defaultPackage = Object.freeze(defaultPackage)
    this.packagesStore = packagesStore

    this.subscribe((currentValue) => (this.currentValue = Promise.resolve(currentValue)))
  }

  public set: (this: void, value: LocalStorageShipment) => void
  public update: (this: void, updater: Updater<LocalStorageShipment>) => void
  public subscribe: (
    this: void,
    run: Subscriber<LocalStorageShipment>,
    invalidate?: (value?: LocalStorageShipment) => void
  ) => Unsubscriber
  public async get(): Promise<LocalStorageShipment> {
    return await this.currentValue
  }

  public async fetch(packageId: number): Promise<LocalStorageShipment> {
    try {
      const pbcPackage = await ShipmentService.getShipment(packageId)
      this.load(pbcPackage)
      return pbcPackage
    } catch (error) {
      console.error(error)
      console.error(`failed to retrieve package with ID "${packageId}" via remote`)
      this.load(this.defaultPackage)
      return this.defaultPackage
    }
  }

  public async sync(): Promise<LocalStorageShipment> {
    const pbcPackage = await this.get()
    const createdPackage = pbcPackage.id
      ? await ShipmentService.updatePackage(pbcPackage)
      : await ShipmentService.createPackage(pbcPackage)
    pbcPackage.id
      ? this.packagesStore.localUpdatePackage(createdPackage)
      : this.packagesStore.localAddPackage(createdPackage)
    
    // let currRecipient = await focusedInmate.get()
    // let updatedRecipient = await RecipientService.getRecipientByDatabaseId(currRecipient.id+"")
    // console.log(updatedRecipient)
    // this.packagesStore.set(updatedRecipient.shipments)

    this.load(createdPackage)

    return createdPackage
  }

  public async delete(): Promise<void> {
    const pbcPackage = await this.get()
    await PackageService.deletePackage(pbcPackage.id)
    this.packagesStore.localRemovePackage(pbcPackage.id)
    this.reset()
  }

  public load(pbcPackage: Shipment) {
    this.set({ ...pbcPackage, existsInDatabase: true })
  }

  public reset() {
    this.set({ ...this.defaultPackage })
  }

  public addBook(book: Book) {
    book["type"] = "book"
    this.update((currentPackage) => ({
      ...currentPackage, content: [...currentPackage.content, book]
    }))
  }

  public addZine(zine: Zine) {
    zine["type"] = "zine"
    this.update((currentPackage) => ({
      ...currentPackage,
      content: [...currentPackage.content, zine]
    }))
  }

  public setRecipient(recipient: Recipient) {
    this.update((currentPackage) => ({
      ...currentPackage, recipient: recipient
    }))
  }

  public setNote(note: Note){
    this.update((currentPackage) => ({
      ...currentPackage, notes: [note]
    }))
  }

  public createAlert(alertText = '') {
    this.update((currentPackage) => ({
      ...currentPackage,
      notes: [{
        id: null,
        content: alertText
      }]
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

const emptyPackage: LocalStorageShipment = {
  id: null,
  date: formatDate(new Date()),

  recipient: null,
  facility: null,

  content: [],
  alert: null
}

export const focusedPackages = new FocusedShipmentsStore(focusedInmate)
export const focusedPackage = new FocusedShipmentStore(emptyPackage, focusedPackages)


