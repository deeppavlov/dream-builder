import { privateApi } from './axiosConfig'

export async function changeLMservice(dist: string, service: string) {
  console.log(console.log(`dist, service = `, dist, service))
  try {
    const { data } = await privateApi.post(
      `assistant_dists/${dist}/lm_service`,
      {
        name: service,
      }
    )

    return data
  } catch (e) {
    console.log(e)
    throw e
  }
}
