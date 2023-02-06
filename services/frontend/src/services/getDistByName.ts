import { privateApi } from "./axiosConfig"

export async function getDistByName(distName: string) {
  const { data } = await privateApi.get(`assistant_dists/${distName}`)
  return data
}
