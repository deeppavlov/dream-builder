import axios from 'axios'
import { privateApi } from './axiosConfig'

export async function publishAssistantDist(dist_name: string) {
  try {
    const { data } = await privateApi.post(
      `/assistant_dists/${dist_name}/publish`
    )
    return data
  } catch (e) {
    console.log(e)
    throw e
  }
}
