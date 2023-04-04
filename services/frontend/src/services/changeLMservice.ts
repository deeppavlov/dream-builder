import { privateApi } from './axiosConfig'

export async function changeLMservice(dist: string, service: string) {
  
  try {
    const { data } = await privateApi.post(
      `assistant_dists/${dist}/lm_service`,
      {
        name: service,
      }
    )

    return data
  } catch (e) {
    throw e
  }
}
