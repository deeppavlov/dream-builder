import { getCookie } from './AuthProvider'
import { api } from './axiosConfig'

export async function getSkillListByDistName(distName: string) {
  try {
    const { data } = await api.get(`skills/${distName}`, {
      headers: {
        token: getCookie('jwt_token'),
      },
    })
    return data
  } catch (e) {
    console.log(e)
  }
}
