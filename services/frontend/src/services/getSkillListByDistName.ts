import { privateApi } from './axiosConfig'

export async function getSkillListByDistName(distName: string) {
  try {
    const { data } = await privateApi.get(`skills/${distName}`)
    return data
  } catch (e) {
    throw e
  }
}
