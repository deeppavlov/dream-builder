import { BotInfoInterface, ELOCALES_KEY } from 'types/types'

export const sortAssistantBylang = (
  dists: BotInfoInterface[],
  language: ELOCALES_KEY
) => {
  return dists?.sort((a, b) => {
    const aLang = a?.language?.value
    const bLang = b?.language?.value

    if (aLang === language && bLang !== language) {
      return -1
    } else if (aLang !== language && bLang === language) {
      return 1
    } else {
      return -a.date_created.localeCompare(b.date_created)
    }
  })
}
