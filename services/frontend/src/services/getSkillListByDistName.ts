import usePrivateApi from '../hooks/usePrivateApi'

export async function getSkillListByDistName(distName: string) {
  const privateApi = usePrivateApi()
  try {
    const { data } = await privateApi.get(`skills/${distName}`)
    return data
  } catch (e) {
    console.log(e)
  }
}
