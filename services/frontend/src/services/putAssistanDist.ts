import axios from 'axios'
import { api } from './axiosConfig'

//replace axios.get with api.get to interract with real endpoint

export async function putAssistantDist(params: string) {
  try {
    await axios.put('/assistant_dists', { params }).then(response => {
      console.log(response)
    })
  } catch (e) {
    console.log(e)
  }
}
