import { ITariffPlan } from 'types/types'
import { privateApi } from 'api/axiosConfig'

export const getTariffPlans = async (): Promise<ITariffPlan[]> => {
  try {
    const { data } = await privateApi.get('plans')
    return data
  } catch (e) {
    throw e
  }
}
