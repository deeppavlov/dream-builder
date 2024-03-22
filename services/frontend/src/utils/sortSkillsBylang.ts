import { ELOCALES_KEY, ISkill } from 'types/types'

const isRussian = (str: string) =>
  /[а-яА-ЯЁё]/.test(str) || /Russian/i.test(str)

export const sortSkillsBylang = (skills: ISkill[], language: ELOCALES_KEY) => {
  return skills?.sort((a, b) => {
    const aName = a?.display_name
    const bName = b?.display_name

    if (isRussian(aName) === isRussian(bName)) {
      return aName.localeCompare(bName)
    }

    if (language === ELOCALES_KEY.ru) {
      return isRussian(aName) ? -1 : 1
    } else if (language === ELOCALES_KEY.en) {
      return !isRussian(aName) ? -1 : 1
    }
    return 0
  })
}
