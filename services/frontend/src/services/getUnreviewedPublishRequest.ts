import { privateApi } from './axiosConfig'

export async function getPublishRequest() {
  try {
    const { data } = await privateApi.get(`/admin/publish_request/unreviewed`)
    return data
  } catch (e) {
    throw e
  }
}
