import axios from 'axios'
import { secureApi } from './axiosConfig'

// replace axios.get with SecureApi.get and delete config with headers to interract with real endpoint

export async function getUsersAssistantDists() {
  try {
    const { data } = await axios.get('/assistant_dists/private', {
      headers: {
        token: localStorage.getItem('token'),
      },
    })
    return data
  } catch (e) {
    console.log(e)
  }
}
