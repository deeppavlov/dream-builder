import axios from 'axios'
import { privateApi } from './axiosConfig'
//replace axios.post with privateApi.post to interract with real endpoint

export async function deleteAssistantDist(dist_name: string) {
  try {
    const { data } = await axios.delete(`/assistant_dists/${dist_name}`)
    return data
  } catch (e) {
    console.log(e)
  }
}
