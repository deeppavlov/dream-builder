import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Main } from '../../components/Main/Main'
import SkillPromptModal from '../../components/SkillPromptModal/SkillPromptModal'
import { useDisplay } from '../../context/DisplayContext'
import { consts } from '../../utils/consts'
import { trigger } from '../../utils/events'

const SkillEditorPage = () => {
  const { options } = useDisplay()
  const skillEditorIsActive = options.get(consts.EDITOR_ACTIVE_SKILL)
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
