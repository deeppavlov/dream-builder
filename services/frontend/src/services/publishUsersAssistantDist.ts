import { privateApi } from './axiosConfig'

export async function publishAssistantDist(
  dist_name: string,
  isPromptVisible: boolean,
  isPublic: boolean
) {
  try {
    const { data } = await privateApi.post(
      `/assistant_dists/${dist_name}/publish/`,
      { is_prompt_visible: isPromptVisible, is_publicly_listed: isPublic }
    )
    return data
  } catch (e) {
    throw e
  }
}
