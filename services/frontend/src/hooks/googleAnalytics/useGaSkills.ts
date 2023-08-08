import { useUIOptions } from 'context'
import { useGAContext } from 'context'
import { useRef } from 'react'
import ga4 from 'react-ga4'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { BotInfoInterface, IGaOptions, ISkill } from 'types/types'
import { usePreview } from 'context/PreviewProvider'
import { consts } from 'utils/consts'
import { getView, safeFunctionWrapper } from 'utils/googleAnalytics'

const buildEventBody = ({
  source_type,
  page_type,
  view,
  skill,
  assistant,
}: IGaOptions) => ({
  source_type,
  page_type,
  view,
  va_id: assistant?.id,
  va_name: assistant?.display_name,
  skill_created_type: 'TODO',
  skill_type: skill?.component_type,
  skill_id: skill?.id,
  skill_name: skill?.display_name,
  skill_template_id: 'TODO',
  skill_template_name: 'TODO',
  event_type: 'Skills',
})

export const useGaSkills = () => {
  const { gaState, setGaState } = useGAContext()
  const { UIOptions } = useUIOptions()
  const { isPreview } = usePreview()
  const queryClient = useQueryClient()
  const { name, skillId } = useParams()
  const isTableView = UIOptions[consts.IS_TABLE_VIEW]

  const getAssistant = () =>
    queryClient.getQueryData(['dist', name]) as BotInfoInterface
  const getSkill = () =>
    queryClient.getQueryData(['component', name, Number(skillId)]) as ISkill

  const skillsPropsOpened = (source_type: string, skill: ISkill) => {
    const page_type = skillId
      ? 'va_skill_editor'
      : isPreview
      ? 'va_template_skillset_page'
      : 'va_skillset_page'
    const view = getView(page_type, isTableView)
    const assistant = getAssistant()
    const eventBody = buildEventBody({
      source_type,
      page_type,
      view,
      skill,
      assistant,
    })

    ga4.event('Skill_Properties_Opened', eventBody)
  }

  const editSkillButtonClick = (source_type: string, skill: ISkill) => {
    const assistant = getAssistant()
    const page_type = 'va_skillset_page'
    const view = getView(page_type, isTableView)

    setGaState({ ...gaState, source_type, page_type, view, skill, assistant })
    const eventBody = buildEventBody({
      source_type,
      page_type,
      view,
      skill,
      assistant,
    })

    ga4.event('Rename_Skill_Button_Click', eventBody)
  }

  const skillRenamed = (editedSkill: ISkill) => {
    const { source_type, page_type, view, skill, assistant } = gaState
    const isRenamed = editedSkill.display_name !== skill?.display_name
    const isDescriptionChanged = editedSkill.description !== skill?.description
    const eventBody = buildEventBody({
      source_type,
      page_type,
      view,
      skill,
      assistant,
    })

    isRenamed && ga4.event('Skill_Renamed', eventBody)
    isDescriptionChanged && ga4.event('Skill_Description_Changed', eventBody)
  }

  const skillDetailsOpened = (source_type: string, skill: ISkill) => {
    const assistant = getAssistant()
    const page_type = skillId
      ? 'va_skill_editor'
      : isPreview
      ? 'va_template_skillset_page'
      : 'va_skillset_page'
    const view = getView(page_type, isTableView)
    const eventBody = buildEventBody({
      source_type,
      page_type,
      view,
      skill,
      assistant,
    })

    ga4.event('Skill_Details_Opened', eventBody)
  }

  const skillDeleteButtonClick = (skill: ISkill) => {
    const source_type = 'skill_block_context_menu'
    const page_type = 'va_skillset_page'
    const view = getView(page_type, isTableView)
    const assistant = getAssistant()

    setGaState({ ...gaState, source_type, page_type, view, skill, assistant })
    const eventBody = buildEventBody({
      source_type,
      page_type,
      view,
      skill,
      assistant,
    })

    ga4.event('Delete_Skill_Button_Click', eventBody)
  }

  const skillDeleted = () => {
    const { source_type, page_type, view, skill, assistant } = gaState
    const eventBody = buildEventBody({
      source_type,
      page_type,
      view,
      skill,
      assistant,
    })

    ga4.event('Skill_Deleted', eventBody)
  }

  const addSkillButtonClick = (source_type: string) => {
    const page_type = 'va_skillset_page'
    const view = getView(page_type, isTableView)
    const assistant = getAssistant()

    ga4.event('Add_Skill_Button_Click', {
      source_type,
      page_type,
      view,
      va_id: assistant.id,
      va_name: assistant.display_name,
    })
  }

  const skillAdded = (skill?: ISkill, template?: ISkill) => {
    const assistant = getAssistant()
    const page_type = 'va_skillset_page'
    const view = getView(page_type, isTableView)
    const source_type = template
      ? 'skill_template_button'
      : 'create_from_scratch_button'
    const skill_created_type = !template ? 'from_scratch' : 'from_template'
    const skill_template_id = template?.id || 'none'
    const skill_template_name = template?.display_name || 'none'

    ga4.event('Skill_Added', {
      source_type,
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
      model_name: skill?.lm_service?.display_name,
    })
  }

  const skillEditorOpened = (
    source_type: 'sidepanel_details_edit' | 'skill_block',
    skill: ISkill
  ) => {
    const page_type = 'va_skillset_page'
    const view = getView(page_type, isTableView)
    const assistant = getAssistant()
    const model_name = skill.lm_service?.display_name
    const eventBody = buildEventBody({
      source_type,
      page_type,
      view,
      skill,
      assistant,
    })

    ga4.event('Skill_Editor_Opened', { ...eventBody, model_name })
  }

  const skillChatRefresh = (skill: ISkill) => {
    const assistant = getAssistant()
    const model_name = skill.lm_service?.display_name
    const eventBody = buildEventBody({
      source_type: 'skill_editor_dialog_panel',
      page_type: 'va_skill_editor',
      view: 'none',
      skill,
      assistant,
    })

    ga4.event('Skill_Chat_Refresh', { ...eventBody, model_name })
  }

  const skillChanged = (skill: ISkill, updatedSkill: ISkill) => {
    const assistant = getAssistant()
    const prompt_changed = skill.prompt !== updatedSkill.prompt
    const model_changed = skill.lm_service !== updatedSkill.lm_service
    const eventBody = buildEventBody({
      source_type: 'skill_editor_dialog_panel',
      page_type: 'va_skill_editor',
      view: 'none',
      skill,
      assistant,
    })

    ga4.event('Skill_Changed', {
      ...eventBody,
      prompt_changed,
      model_changed,
      old_model_name: skill.lm_service?.display_name,
      new_model_name: updatedSkill.lm_service?.display_name,
    })
  }

  const skillChatSend = (skill: ISkill | null, historyLength: number) => {
    const assistant = getAssistant()
    const requiredApiKey = skill?.lm_service?.name.includes('openai-api')
    const eventName = historyLength ? 'Skill_Chat_Send' : 'Skill_Chat_Start'
    const eventBody = buildEventBody({
      source_type: 'skill_editor_dialog_panel',
      page_type: 'va_skill_editor',
      view: 'none',
      skill: skill as ISkill,
      assistant,
    })

    ga4.event(eventName, {
      ...eventBody,
      additional_services: requiredApiKey,
      model_name: skill?.lm_service?.display_name,
    })
  }

  const changeSkillModel = (newLmService: any) => {
    const assistant = getAssistant()
    const skill = getSkill()
    const eventBody = buildEventBody({
      source_type: 'skill_editor_dialog_panel',
      page_type: 'va_skill_editor',
      view: 'none',
      skill,
      assistant,
    })

    ga4.event('Skill_Model_Edited', {
      ...eventBody,
      old_model_name: skill.lm_service?.display_name,
      new_model_name: newLmService?.display_name,
    })
  }

  const promptIsDirty = useRef(false)
  const skillPromptEdited = () => {
    if (promptIsDirty.current) return

    promptIsDirty.current = true
    const assistant = getAssistant()
    const skill = getSkill()
    const eventBody = buildEventBody({
      source_type: 'skill_editor_dialog_panel',
      page_type: 'va_skill_editor',
      view: 'none',
      skill,
      assistant,
    })

    ga4.event('Skill_Prompt_Edited', {
      ...eventBody,
      model_name: skill.lm_service?.display_name,
    })
  }

  const editorBtnClicked = useRef(false)
  const editorCloseButtonClick = () => {
    editorBtnClicked.current = true
  }
  const skillEditorClosed = () => {
    const assistant = getAssistant()
    const skill = getSkill()
    const source_type = editorBtnClicked.current ? 'close_button' : 'other_link'
    const eventBody = buildEventBody({
      source_type,
      page_type: 'va_skill_editor',
      view: 'none',
      skill,
      assistant,
    })

    ga4.event('Skill_Editor_Closed', {
      ...eventBody,
      model_name: skill.lm_service?.display_name,
    })
  }

  const skillsetViewChanged = (view: 'card' | 'list') => {
    ga4.event('VA_Skillset_View_Changed', {
      source_type: 'top_panel',
      page_type: 'va_skillset_page',
      view,
    })
  }

  return {
    skillsPropsOpened: safeFunctionWrapper(skillsPropsOpened),
    editSkillButtonClick: safeFunctionWrapper(editSkillButtonClick),
    skillRenamed: safeFunctionWrapper(skillRenamed),
    skillDetailsOpened: safeFunctionWrapper(skillDetailsOpened),
    skillDeleteButtonClick: safeFunctionWrapper(skillDeleteButtonClick),
    skillDeleted: safeFunctionWrapper(skillDeleted),
    addSkillButtonClick: safeFunctionWrapper(addSkillButtonClick),
    skillAdded: safeFunctionWrapper(skillAdded),
    skillEditorOpened: safeFunctionWrapper(skillEditorOpened),
    skillChatRefresh: safeFunctionWrapper(skillChatRefresh),
    skillChanged: safeFunctionWrapper(skillChanged),
    skillChatSend: safeFunctionWrapper(skillChatSend),
    changeSkillModel: safeFunctionWrapper(changeSkillModel),
    skillPromptEdited: safeFunctionWrapper(skillPromptEdited),
    skillEditorClosed: safeFunctionWrapper(skillEditorClosed),
    skillsetViewChanged: safeFunctionWrapper(skillsetViewChanged),
    editorCloseButtonClick: safeFunctionWrapper(editorCloseButtonClick),
  }
}
