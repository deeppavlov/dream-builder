import usePrivateApi from '../hooks/usePrivateApi'

export async function getDistByName(distName: string) {
  const privateApi = usePrivateApi()
  const { data } = await privateApi.get(`assistant_dists/${distName}`)
  return data
}
