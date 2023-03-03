import { privateApi } from './axiosConfig'

export async function getUsersAssistantDists() {
  try {
    const { data } = await privateApi.get('/assistant_dists/private')
    return data
  } catch (e) {
    console.log(e)
  }
}
