import { useUIOptions } from 'context'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import { updateAssistantLastUsedDate } from 'utils/updateAssistantLastUsedDate'
import { SkillPromptModal } from 'components/Modals'
import { Main } from 'components/UI'

const SkillEditorPage = () => {
  const { UIOptions } = useUIOptions()
  const skillEditorIsActive = UIOptions[consts.EDITOR_ACTIVE_SKILL]
  const { name, skillId } = useParams()

  // TODO: FIX
  useEffect(() => {
    if (skillId && !skillEditorIsActive) {
      return trigger('SkillPromptModal', { isOpen: true })
    }
  }, [skillId])

  useEffect(() => () => updateAssistantLastUsedDate(name!))

  return (
    <Main sidebar editor>
      <SkillPromptModal />
    </Main>
  )
}

export default SkillEditorPage
