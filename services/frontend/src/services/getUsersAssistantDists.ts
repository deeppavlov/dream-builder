import { privateApi } from './axiosConfig'
// replace axios.get with SecureApi.get and delete config with headers to interract with real endpoint

export async function getUsersAssistantDists() {
  try {
    const { data } = await privateApi.get('/assistant_dists/private')
    return data
  } catch (e) {
    console.log(e)
  }
}
