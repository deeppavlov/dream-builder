import { IPublicationRequest } from 'types/types'
import { privateApi } from 'api/axiosConfig'

export async function getPublishRequest(): Promise<IPublicationRequest[]> {
  try {
    const { data } = await privateApi.get(`/admin/publish_request/unreviewed`)
    return data
  } catch (e) {
    throw e
  }
}
