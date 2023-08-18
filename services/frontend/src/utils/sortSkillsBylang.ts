import { ELOCALES_KEY, ISkill } from 'types/types'

export const sortSkillsBylang = (skills: ISkill[], language: ELOCALES_KEY) => {
  return skills?.sort((a, b) => {
    const aName = a?.display_name
    const bName = b?.display_name
    const regexRu = /[а-яА-ЯЁё]/
    const regexEn = /Russian/i

    if (language === ELOCALES_KEY.ru) {
      if (regexRu.test(aName) || regexEn.test(aName)) {
        return -1
      } else if (regexRu.test(bName) || regexEn.test(bName)) {
        return 1
      }
    } else if (language === ELOCALES_KEY.en) {
      if (!regexRu.test(aName) && !regexEn.test(aName)) {
        return -1
      } else if (!regexRu.test(bName) && !regexEn.test(bName)) {
        return 1
      }
    }
    return 0
  })
}
