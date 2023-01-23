import { api } from './axiosConfig'

export async function getComponentsFromAssistantDists(distName: string) {
  try {
    const { data } = await api.get(`assistant_dists/${distName}/components/`, {
      headers: {
        token: localStorage.getItem('token'),
      },
    })
    return data
  } catch (e) {
    console.log(e)
  }
}
