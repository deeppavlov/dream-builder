import { getCookie } from './AuthProvider'
import { api } from './axiosConfig'

export async function getComponentsFromAssistantDists(distName: string) {
  try {
    const { data } = await api.get(`assistant_dists/${distName}/components/`, {
      headers: {
        token: getCookie('jwt_token'),
      },
    })
    return data
  } catch (e) {
    console.log(e)
  }
}
