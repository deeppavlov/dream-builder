export interface UserInterface {
  name: string
  email: string
  picture: string
}

export interface UserContext {
  user: UserInterface | null
  setUser: (user: UserInterface) => void
  login: (res: any) => void
  logout: () => void
}
