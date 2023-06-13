import { privateApi } from 'api/axiosConfig'

export async function getPrivateAssistants() {
  try {
    const { data } = await privateApi.get('/assistant_dists/user_owned')
    return data
  } catch (e) {
    throw e
  }
}
