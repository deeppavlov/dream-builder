import { getCookie } from './AuthProvider'
import { api } from './axiosConfig'

export async function getDistByName(distName: string) {
  try {
    const { data } = await api.get(`assistant_dists/${distName}`, {
      headers: {
        token: getCookie('jwt_token'),
      },
    })
    return data
  } catch (e) {
    console.log(e)
  }
}