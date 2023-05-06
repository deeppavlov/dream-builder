import { api } from './axiosConfig'

export async function getSkillList() {
  const { data } = await api.get('skills')
  return data
}
