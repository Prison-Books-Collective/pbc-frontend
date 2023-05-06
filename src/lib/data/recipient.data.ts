import { recipientClient } from '$services/bellbooks-backend/recipient.client'
import { loading } from '../stores/loading'
import { isEmpty } from '$util/strings'
import { AppStore } from '$util/store'

import type { Recipient } from '$models/pbc/recipient'

const defaultRecipient: Recipient = {
  id: -1,
  firstName: 'default',
  lastName: 'default',
  shipments: [],
}

export class RecipientStore extends AppStore<Recipient> {
  constructor() {
    super('RecipientStore', defaultRecipient)
  }

  public async fetch({ id }: { id: string }): Promise<Recipient> {
    if (isEmpty(id)) return this.getLatest()

    loading.start()
    const recipient = await recipientClient.getRecipientByAssignedId(id)
    loading.end()

    if (recipient === null) {
      this.error(`Failed to fetch recipient by id "${id}"`)
      return this.getLatest()
    }
    this.set(recipient)
    return recipient
  }

  public async fetchByDatabaseId({ id }: { id: string }): Promise<Recipient> {
    if (isEmpty(id)) return this.getLatest()

    loading.start()
    const recipient = await recipientClient.getRecipientByDatabaseId(id)
    loading.end()

    if (recipient === null) {
      this.error(`Failed to fetch recipient by database id "${id}"`)
      return this.getLatest()
    }
    this.set(recipient)
    return recipient
  }

  public async sync(): Promise<Recipient> {
    loading.start()
    const updatedRecipient = await recipientClient.updateRecipient(this.getLatest())
    loading.end()

    if (updatedRecipient === null) {
      this.error('Failed to sync recipient updates to server')
      return this.getLatest()
    }

    this.set(updatedRecipient)
    return updatedRecipient
  }

  public load(loadedData: Recipient): Recipient {
    this.set(loadedData)
    return loadedData
  }
}

export const recipient = new RecipientStore()
