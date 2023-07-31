import { useAuth, useUIOptions } from 'context'
import { useGAContext } from 'context'
import ga4 from 'react-ga4'
import { useQueryClient } from 'react-query'
import { useLocation, useParams } from 'react-router-dom'
import { BotInfoInterface, ISkill } from 'types/types'
import { usePreview } from 'context/PreviewProvider'
import { consts } from 'utils/consts'

type PageType =
  | 'va_skillset_page'
  | 'va_template_skillset_page'
  | 'skill_editor'
  | 'va_skill_editor'

export const useGaSkills = () => {
  const auth = useAuth()
  const isAuth = !!auth?.user
  const location = useLocation()
  // const { gaState, setGaState } = useGAContext()
  const { UIOptions } = useUIOptions()
  const { isPreview } = usePreview()
  const queryClient = useQueryClient()
  const { name } = useParams()

  const getView = (): string => {
    return UIOptions[consts.IS_TABLE_VIEW] ? 'list' : 'card'
  }

  const skillsPropsOpened = (source: string, skill: ISkill) => {
    const page_type = isPreview
      ? 'va_template_skillset_page'
      : 'va_skillset_page'

    const currentVa = queryClient.getQueryData([
      'dist',
      name,
    ]) as BotInfoInterface

    ga4.event('Skill_Properties_Opened', {
      source,
      page_type,
      view: getView(),

      va_id: currentVa.id,
      va_name: currentVa.display_name,
      skill_created_type: 'TODO',
      skill_type: skill.component_type,
      skill_id: skill.id,
      skill_name: skill.display_name,
      skill_template_id: 'TODO',
      skill_template_name: 'TODO',
    })
  }

  return { skillsPropsOpened }
}
