import { api } from './axiosConfig'

export async function getGenerativeConf(componentId: number) {
  try {
    const { data } = await api.get(
      `components/${componentId}/generative_config`
    )
    return data
  } catch (e) {
    throw e
  }
}
