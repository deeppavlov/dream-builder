import { ELOCALES_KEY } from 'types/types'
import { DEBUG_EN_DIST, DEBUG_RU_DIST } from 'constants/constants'

export const chooseUniversalPrompted = (locale: ELOCALES_KEY) =>
  ({
    [ELOCALES_KEY.en]: DEBUG_EN_DIST,
    [ELOCALES_KEY.ru]: DEBUG_RU_DIST,
  }[locale])
