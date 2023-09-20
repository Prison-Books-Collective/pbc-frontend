import { Store } from '$util/store'

interface Navbar {
  title?: string
  subtitle?: string
}

export class NavbarController extends Store<Navbar> {
  constructor() {
    super('NavbarController', {})
  }

  public fetch(): Promise<Navbar> {
    return Promise.resolve(this.getLatest())
  }
  public sync(): Promise<Navbar> {
    return Promise.resolve(this.getLatest())
  }
  public load(newValue: Navbar): Navbar {
    this.set(newValue)
    return newValue
  }

  public title(title: string) {
    this.set({
      ...this.getLatest(),
      title,
    })
  }

  public subtitle(subtitle: string) {
    this.set({
      ...this.getLatest(),
      subtitle,
    })
  }
}

export const navbarController = new NavbarController()
