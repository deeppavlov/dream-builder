import axios, { AxiosError } from 'axios'
import { secureApi } from './axiosConfig'

//replace axios.put with secureApi.put to interract with real endpoint

interface PutDistParams {
  display_name: string
  description: string
}

export async function putAssistantDist(params: PutDistParams) {
  try {
    const { data } = await axios.put('/assistant_dists', { params })
    return data
  } catch (e) {
    console.log(e)
  }
}
