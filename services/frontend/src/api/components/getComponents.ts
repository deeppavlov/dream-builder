import { BotInfoInterface } from 'types/types'
import { privateApi } from 'api/axiosConfig'

export async function getComponents(
  distName: string,
  isDistName: undefined | BotInfoInterface = undefined
) {
  try {
    const { data } = await privateApi.get(
      `assistant_dists/${distName}/components`
    )
    if (isDistName) {
      data['distName'] = distName

      return data
    }
    return data
  } catch (e) {
    throw e
  }
}
