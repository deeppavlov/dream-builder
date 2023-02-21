import axios from 'axios'
import { privateApi } from './axiosConfig'
//replace axios.post with privateApi.post to interract with real endpoint

export async function renameAssistantDist(
  distName: string,
  newInfo: { display_name: string; description: string }
) {
  try {
    const { data } = await axios.patch(`/assistant_dists/${distName}`, newInfo)
    return data
  } catch (e) {
    console.log(e)
  }
}
