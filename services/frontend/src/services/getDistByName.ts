import { secureApi } from './axiosConfig'

export async function getDistByName(distName: string) {
  try {
    const { data } = await secureApi.get(`assistant_dists/${distName}`)
    return data
  } catch (e) {
    console.log(e)
  }
}
