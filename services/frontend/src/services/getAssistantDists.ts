import axios from 'axios'

export async function getAssistantDists() {
  const { data } = await axios.get('http://10.11.1.8:7000/api/assistant_dists')
  return data
}
