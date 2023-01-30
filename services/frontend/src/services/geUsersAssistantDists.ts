import axios from 'axios'
import { api } from './axiosConfig'

//replace axios.get with api.get to interract with real endpoint

export async function getUsersAssistantDists() {
  try {
    const { data } = await axios.get('/assistant_dists/private')
    return data
  } catch (e) {
    console.log(e)
  }
}
