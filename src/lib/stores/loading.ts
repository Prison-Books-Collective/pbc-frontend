import {
  writable,
  type Subscriber,
  type Unsubscriber,
  type Updater,
  type Writable,
} from 'svelte/store'

export class LoadingController implements Writable<boolean> {
  constructor() {
    const { set, update, subscribe } = writable(false)

    this.set = set
    this.update = update
    this.subscribe = subscribe
  }

  public set: (this: void, value: boolean) => void
  public update: (this: void, updater: Updater<boolean>) => void
  public subscribe: (
    this: void,
    run: Subscriber<boolean>,
    invalidate?: (value?: boolean) => void,
  ) => Unsubscriber

  public start() {
    this.set(true)
  }

  public end() {
    this.set(false)
  }
}

export const loading = new LoadingController()
