import { api } from './axiosConfig'

export async function getComponentsGroup(group_name: string) {
  try {
    const { data } = await api.get(`components/group/${group_name}`)
    return data
  } catch (e) {
    throw e
  }
}
