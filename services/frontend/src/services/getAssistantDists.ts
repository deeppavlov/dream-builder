import axios from 'axios'

export async function getAssistantDists() {
  const { data } = await axios.get(
    'https://alpha.deepdream.builders:6998/api/assistant_dists/'
  )

  return data
}
