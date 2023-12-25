import { BotInfoInterface } from 'types/types'
import { privateApi } from 'api/axiosConfig'

export async function getComponents(
  distName: string,
  isDistName?: BotInfoInterface
) {
  try {
    const { data } = await privateApi.get(
      `assistant_dists/${distName}/components`
    )

    return isDistName ? { ...data, distName } : data
  } catch (e) {
    throw e
  }
}
