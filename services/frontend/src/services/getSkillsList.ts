import { api } from './axiosConfig'

export async function getSkillList() {
  try {
    const { data } = await api.get('skills/')
    return data
  } catch (e) {
    console.log(e)
  }
}
