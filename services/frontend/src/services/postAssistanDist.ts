import axios from 'axios'
import { api } from './axiosConfig'

//replace axios.get with api.get to interract with real endpoint

export async function postAssistantDist(params: string) {
  try {
    await axios.post('/assistant_dists', { params }).then(response => {
      console.log(response)
    })
  } catch (e) {
    console.log(e)
  }
}
