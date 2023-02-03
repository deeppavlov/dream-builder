import usePrivateApi from '../hooks/usePrivateApi'

export async function getComponentsFromAssistantDists(distName: string) {
  const privateApi = usePrivateApi()

  try {
    const { data } = await privateApi.get(
      `assistant_dists/${distName}/components/`
    )
    return data
  } catch (e) {
    console.log(e)
  }
}
