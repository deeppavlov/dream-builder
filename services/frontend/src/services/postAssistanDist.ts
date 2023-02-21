import axios from 'axios'
import { privateApi } from './axiosConfig'
//replace axios.post with privateApi.post to interract with real endpoint

interface PutDistParams {
  display_name: string
  description: string
}

export async function postAssistantDist(params: PutDistParams) {
  try {
    const { data } = await axios.post('/assistant_dists/private', {
      params,
    })
    return data
  } catch (e) {
    console.log(e)
  }
}
