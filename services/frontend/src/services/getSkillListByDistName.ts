import { api } from './axiosConfig'

export async function getSkillListByDistName(distName: string) {
  try {
    const { data } = await api.get(`skills/${distName}`, {
      headers: {
        token:  localStorage.getItem('token'),
      },
    })
    return data
  } catch (e) {
    console.log(e)
  }
}
