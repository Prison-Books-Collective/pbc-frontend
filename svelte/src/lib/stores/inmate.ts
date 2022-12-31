import {
  writable,
  type Subscriber,
  type Unsubscriber,
  type Updater,
  type Writable
} from 'svelte/store'
import type { Inmate } from '$models/pbc/inmate'
import { InmateService } from '$services/pbc/inmate.service'
import { isEmpty } from '$util/strings'
import type { Recipient } from '$models/pbc/recipient'
import { RecipientService } from '$services/pbc/recipient.service'

interface LocalStorageInmate extends Inmate {
  [additionalFields: string]: any
}

interface LocalStorageRecipient extends Recipient {

}

export class FocusedInmateStore implements Writable<LocalStorageInmate> {
  private readonly defaultInmate

  constructor(defaultInmate: LocalStorageInmate) {
    const { set, update, subscribe } = writable(defaultInmate)

    this.set = set
    this.update = update
    this.subscribe = subscribe

    this.defaultInmate = Object.freeze(defaultInmate)
  }

  public set: (this: void, value: LocalStorageInmate) => void
  public update: (this: void, updater: Updater<LocalStorageInmate>) => void
  public subscribe: (
    this: void,
    run: Subscriber<LocalStorageInmate>,
    invalidate?: (value?: LocalStorageInmate) => void
  ) => Unsubscriber

  public reset() {
    this.set({ ...this.defaultInmate })
  }

  public async TODO_fetchByAssignedId(assignedId: string): Promise<LocalStorageRecipient> {
    if(isEmpty(assignedId)) return

    try {
      const foundRecipient = await RecipientService.getRecipientByAssignedId(assignedId)
      
      if(foundRecipient) {
        this.set(foundRecipient as any) // todo: forcing typechecker to allow
        return foundRecipient
      } else {
        return null
      }
    } catch (error) {
      console.error(error)
      console.error(`failed to set store $focusedInmate via remote using ID "${assignedId}"`)
      this.reset()
      return null
    }
  }

  public async fetch(id: string | number): Promise<Inmate> {
    if(isEmpty(id as string)) return

    try {
      const foundInmate = await InmateService.getInmateUnknownIdStatus(id)
      this.set(foundInmate)
      return foundInmate
    } catch (error) {
      console.error(error)
      console.error(`failed to set store $focusedInmate via remote using ID "${id}"`)
      this.reset()
      return emptyInmate
    }
  }
}

const emptyInmate: LocalStorageInmate = {
  id: null,

  firstName: null,
  middleInitial: null,
  lastName: null,

  packages: null,
  location: null
}

export const focusedInmate = new FocusedInmateStore(emptyInmate)
