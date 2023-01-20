import { api } from './axiosConfig'

export async function getDistByName(distName: string) {
  try {
    const { data } = await api.get(`assistant_dists/${distName}`, {
      headers: {
        token: localStorage.getItem('token'),
      },
    })
    return data
  } catch (e) {
    console.log(e)
  }
}
