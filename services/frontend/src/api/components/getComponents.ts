import { privateApi } from 'api/axiosConfig'

export async function getComponents(distName: string) {
  try {
    const { data } = await privateApi.get(
      `assistant_dists/${distName}/components`
    )
    return data
  } catch (e) {
    throw e
  }
}
