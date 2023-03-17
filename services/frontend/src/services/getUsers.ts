import { privateApi } from './axiosConfig'

interface User {
  id: number
  email: string
  sub: string
  picture: string
  fullname: string
  given_name: string
  family_name: string
}

export async function getUsers() {
  try {
    const { data } = await privateApi.get<User[]>('users')
    return data
  } catch (e) {
    console.log(e)
  }
}
