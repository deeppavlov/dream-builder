import axios from 'axios'
import { privateApi } from './axiosConfig'
//replace axios.post with privateApi.post to interract with real endpoint

export async function publishAssistantDist(dist_name: string) {
  try {
    const { data } = await axios.post(`/assistant_dists/${dist_name}/publish`)
    return data
  } catch (e) {
    console.log(e)
  }
}
