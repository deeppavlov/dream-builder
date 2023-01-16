import { api } from './axiosConfig'

export async function getSkillListByDistName(distName: string) {
  const { data } = await api.get(`skills/${distName}`, {
    headers: {
      token: localStorage.getItem('token'),
    },
  })
  return data
}
