import { PageType } from 'types/types'

export const getPageType = (
  pathName: string,
  isPreview: boolean,
  skillId?: string
): PageType => {
  let pageType: PageType
  switch (pathName) {
    case '/':
      pageType = 'all_va_page'
      break
    case '/allbots':
      pageType = 'allbots'
      break
    case '/yourbots':
      pageType = 'yourbots'
      break
    case '/admin':
      pageType = 'admin_panel'
      break
    default:
      pageType = skillId
        ? 'va_skill_editor'
        : isPreview
        ? 'va_template_skillset_page'
        : 'va_skillset_page'
      break
  }
  return pageType
}

export const getView = (pageType: PageType, isTableView: boolean) => {
  if (
    [
      'va_skillset_page',
      'va_skill_editor',
      'va_template_skillset_page',
      'admin_panel',
    ].includes(pageType)
  )
    return 'none'
  return isTableView ? 'list' : 'card'
}

export const getSkillView = (pageType: PageType, isTableView: boolean) => {
  if (pageType === 'va_skill_editor') {
    return 'none'
  }

  return isTableView ? 'list' : 'card'
}

export const safeFunctionWrapper =
  <T extends any[]>(func: (...args: T) => void) =>
  (...args: T) => {
    if (import.meta.env.MODE === 'DEV') return

    try {
      func(...args)
    } catch (error) {
      console.error(error)
    }
  }
