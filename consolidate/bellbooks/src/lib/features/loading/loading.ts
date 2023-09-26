import { Store } from '$util/store'

export class LoadingController extends Store<boolean> {
  constructor() {
    super('LoadingController', false)
  }

  public fetch(): Promise<boolean> {
    return Promise.resolve(this.getLatest())
  }
  public sync(): Promise<boolean> {
    return Promise.resolve(this.getLatest())
  }
  public load(newValue: boolean): boolean {
    this.set(newValue)
    return newValue
  }

  public start() {
    this.set(true)
  }

  public end() {
    this.set(false)
  }

  public async displayWhile<ReturnType>(callback: () => Promise<ReturnType>): Promise<ReturnType> {
    this.start()
    const result = await callback()
    this.end()
    return result
  }

  public isLoading(): boolean {
    return this.getLatest()
  }
}

export const loadingController = new LoadingController()
