import {
  writable,
  type Subscriber,
  type Unsubscriber,
  type Updater,
  type Writable,
} from 'svelte/store'
import { ErrorStrategy } from './error'

export const ERROR_STRATEGY: ErrorStrategy = import.meta.env.VITE_ERROR_STRATEGY

export abstract class AppStore<DataType> implements Writable<DataType> {
  private name: string
  private readonly defaultState: DataType
  private latest: DataType

  constructor(name: string, defaultState: DataType) {
    this.name = name
    const { set, update, subscribe } = writable(defaultState)

    this.set = set
    this.update = update
    this.subscribe = subscribe

    this.defaultState = Object.freeze(defaultState)
    this.latest = defaultState

    this.subscribe((newState) => (this.latest = newState))
  }

  public set: (this: void, value: DataType) => void
  public update: (this: void, updater: Updater<DataType>) => void
  public subscribe: (
    this: void,
    run: Subscriber<DataType>,
    invalidate?: (value?: DataType) => void,
  ) => Unsubscriber
  public reset() {
    if (Array.isArray(this.defaultState)) {
      this.set([...this.defaultState])
    } else {
      this.set({ ...this.defaultState })
    }
  }

  public abstract fetch(identifiers: unknown): Promise<DataType | null>
  public abstract sync(): Promise<DataType>
  public abstract load(loadedData: DataType): DataType

  public getLatest() {
    return Object.freeze({ ...this.latest })
  }
  protected logID = ({ method }: { method: string }) => `[ ${this.name} ]( ${method} )`

  protected error(method: string, message: string) {
    switch (ERROR_STRATEGY) {
      case ErrorStrategy.SILENT:
        break
      case ErrorStrategy.LOG:
        console.error(`${this.logID({ method })} ${message}`)
        break
      case ErrorStrategy.THROW:
        throw new Error(`${this.logID({ method })} ${message}`)
    }
  }
}
