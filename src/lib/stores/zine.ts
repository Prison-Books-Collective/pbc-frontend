import {
  writable,
  type Subscriber,
  type Unsubscriber,
  type Updater,
  type Writable,
} from 'svelte/store'
import type { Zine } from '$models/pbc/shipment'
import { ZineService } from '$services/pbc/zine.service'

export class ZineStore implements Writable<Zine[]> {
  constructor() {
    const { set, update, subscribe } = writable([])

    this.set = set
    this.update = update
    this.subscribe = subscribe
  }

  public set: (this: void, value: Zine[]) => void
  public update: (this: void, updater: Updater<Zine[]>) => void
  public subscribe: (
    this: void,
    run: Subscriber<Zine[]>,
    invalidate?: (value?: Zine[]) => void,
  ) => Unsubscriber

  public async fetch(): Promise<Zine[]> {
    try {
      const zines = await ZineService.getZines()
      this.set(zines)
      return zines
    } catch (error) {
      console.error(`failed to sync $zines via remote`, error)
    }
    return null
  }

  public async create({ code, title }: Partial<Zine>): Promise<Zine> {
    try {
      const createdZine = await ZineService.createZine({
        code: code as string,
        title: title as string,
      })
      this.fetch()
      return createdZine
    } catch (error) {
      console.error(
        `failed to create new zine for $zines via remote using data: ${JSON.stringify({
          code,
          title,
        })}`,
        error,
      )
      return null
    }
  }
}

export const zines = new ZineStore()
zines.fetch()
