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

  public title(title: string, subtitle?: string) {
    this.set({
      title,
      subtitle,
    })
  }

  public subtitle(subtitle: string) {
    this.set({
      subtitle,
    })
  }
}

export const navbarController = new NavbarController()
