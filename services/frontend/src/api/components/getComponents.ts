import { BotInfoInterface, ISkill, LanguageModel } from 'types/types'
import { privateApi } from 'api/axiosConfig'
import getTokensLength from 'utils/getTokensLength'

export async function getComponents(
  distName: string,
  isDistName?: BotInfoInterface
) {
  try {
    const { data } = await privateApi.get(
      `assistant_dists/${distName}/components`
    )

    data.skills.forEach((el: ISkill) => {
      if (el.display_name !== 'Dummy Skill') {
        const lmModel = el.lm_service?.name as LanguageModel | undefined
        el.count_token = getTokensLength(lmModel, el.prompt ?? '')
      }
    })
    return isDistName ? { ...data, distName } : data
  } catch (e) {
    throw e
  }
}
