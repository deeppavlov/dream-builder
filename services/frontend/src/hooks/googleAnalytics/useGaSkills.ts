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
  const { gaState, setGaState } = useGAContext()
  const { UIOptions } = useUIOptions()
  const { isPreview } = usePreview()
  const queryClient = useQueryClient()
  const { name, skillId } = useParams()

  const getView = (page_type: string): string => {
    if (['skill_editor', 'va_skill_editor'].includes(page_type)) return 'none'
    return UIOptions[consts.IS_TABLE_VIEW] ? 'list' : 'card'
  }
  const getAssistant = () =>
    queryClient.getQueryData(['dist', name]) as BotInfoInterface

  const skillsPropsOpened = (source: string, skill: ISkill) => {
    const page_type = skillId
      ? 'skill_editor'
      : isPreview
      ? 'va_template_skillset_page'
      : 'va_skillset_page'

    const currentVa = queryClient.getQueryData([
      'dist',
      name,
    ]) as BotInfoInterface

    ga4.event('Skill_Properties_Opened', {
      source,
      page_type,
      view: getView(page_type),

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

  const editSkillButtonClick = (source: string, skill: ISkill) => {
    const assistant = getAssistant()
    const page_type = 'va_skillset_page'
    const view = getView(page_type)

    setGaState({ ...gaState, source, page_type, view, skill, assistant })

    ga4.event('Rename_Skill_Button_Click', {
      source,
      page_type,
      view,

      skill_created_type: 'TODO',
      skill_type: skill.component_type,
      va_id: assistant.id,
      va_name: assistant.display_name,
      skill_id: skill.id,
      skill_name: skill.display_name,
      skill_template_id: 'TODO',
      skill_template_name: 'TODO',
    })
  }

  const skillRenamed = (editedSkill: ISkill) => {
    const { source, page_type, view, skill, assistant } = gaState
    const isRenamed = editedSkill.display_name !== skill?.display_name
    const isDescriptionChanged = editedSkill.description !== skill?.description

    const eventBody = {
      source,
      page_type,
      view,
      skill_created_type: 'TODO',
      skill_type: skill?.component_type,
      va_id: assistant?.id,
      va_name: assistant?.display_name,
      skill_id: skill?.id,
      skill_name: skill?.display_name,
      skill_template_id: 'TODO',
      skill_template_name: 'TODO',
    }

    isRenamed && ga4.event('Skill_Renamed', eventBody)
    isDescriptionChanged && ga4.event('Skill_Description_Changed', eventBody)
  }

  const skillDetailsOpened = (source: string, skill: ISkill) => {
    const assistant = getAssistant()
    const page_type = skillId
      ? 'skill_editor'
      : isPreview
      ? 'va_template_skillset_page'
      : 'va_skillset_page'
    const view = getView(page_type)

    ga4.event('Skill_Details_Opened', {
      source,
      page_type,
      view,
      skill_created_type: 'TODO',
      skill_type: skill?.component_type,
      va_id: assistant?.id,
      va_name: assistant?.display_name,
      skill_id: skill?.id,
      skill_name: skill?.display_name,
      skill_template_id: 'TODO',
      skill_template_name: 'TODO',
    })
  }

  const skillDeleteButtonClick = (skill: ISkill) => {
    const source = 'skill_block_context_menu'
    const page_type = 'va_skillset_page'
    const view = getView(page_type)
    const assistant = getAssistant()

    setGaState({ ...gaState, source, page_type, view, skill, assistant })

    ga4.event('Delete_Skill_Button_Click', {
      source,
      page_type,
      view,
      skill_created_type: 'TODO',
      skill_type: skill.component_type,
      va_id: assistant.id,
      va_name: assistant.name,
      skill_id: skill.id,
      skill_name: skill.display_name,
      skill_template_id: 'TODO',
      skill_template_name: 'TODO',
    })
  }

  const skillDeleted = () => {
    const { source, page_type, view, skill, assistant } = gaState

    ga4.event('Skill_Deleted', {
      source,
      page_type,
      view,
      skill_created_type: 'TODO',
      skill_type: skill?.component_id,
      va_id: assistant?.id,
      va_name: assistant?.display_name,
      skill_id: 1234,
      skill_name: skill?.display_name,
      skill_template_id: 'TODO',
      skill_template_name: 'TODO',
    })
  }

  const addSkillButtonClick = (source: string) => {
    const page_type = 'va_skillset_page'
    const view = getView(page_type)
    const assistant = getAssistant()

    console.log('Add_Skill_Button_Click', {
      source,
      page_type,
      view,
      va_id: assistant.id,
      va_name: assistant.display_name,
    })
  }

  const skillAdded = (skill?: ISkill, template?: ISkill) => {
    const page_type = 'va_skillset_page'
    const view = getView(page_type)
    const source = template
      ? 'skill_template_button'
      : 'create_from_scratch_button'
    const assistant = getAssistant()

    const skill_created_type = !template ? 'from_scratch' : 'from_template'
    const skill_template_id = template?.id || 'none'
    const skill_template_name = template?.display_name || 'none'

    console.log('Skill_Added', {
      source,
      page_type,
      view,
      skill_created_type,
      skill_type: skill?.component_type,
      va_id: assistant?.id,
      va_name: assistant?.display_name,
      skill_id: skill?.id,
      skill_name: skill?.display_name,
      skill_template_id,
      skill_template_name,
      model_type: skill?.model_type,
    })
  }

  return {
    skillsPropsOpened,
    editSkillButtonClick,
    skillRenamed,
    skillDetailsOpened,
    skillDeleteButtonClick,
    skillDeleted,
    addSkillButtonClick,
    skillAdded,
  }
}
