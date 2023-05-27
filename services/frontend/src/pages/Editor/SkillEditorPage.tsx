import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Main } from '../../components/Main/Main'
import SkillPromptModal from '../../components/SkillPromptModal/SkillPromptModal'
import { useUIOptions } from '../../context/UIOptionsContext'
import { consts } from '../../utils/consts'
import { trigger } from '../../utils/events'

const SkillEditorPage = () => {
  const { UIOptions } = useUIOptions()
  const skillEditorIsActive = UIOptions[consts.EDITOR_ACTIVE_SKILL]
  const { skillId } = useParams()

  // TODO: FIX
  useEffect(() => {
    if (skillId && !skillEditorIsActive) {
      return trigger('SkillPromptModal', { isOpen: true })
    }
  }, [skillId])

  return (
    <Main sidebar editor>
      <SkillPromptModal />
    </Main>
  )
}

export default SkillEditorPage
