import { secureApi } from './axiosConfig'

export async function getComponentsFromAssistantDists(distName: string) {
  try {
    const { data } = await secureApi.get(
      `assistant_dists/${distName}/components/`
    )
    return data
  } catch (e) {
    console.log(e)
  }
}
