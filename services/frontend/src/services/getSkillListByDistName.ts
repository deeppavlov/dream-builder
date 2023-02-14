import { api, secureApi } from './axiosConfig'

export async function getSkillListByDistName(distName: string) {
  try {
    const { data } = await secureApi.get(`skills/${distName}`)
    return data
  } catch (e) {
    console.log(e)
  }
}
