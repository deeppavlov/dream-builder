import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Main } from '../../components/Main/Main'
import SkillPromptModal from '../../components/SkillPromptModal/SkillPromptModal'
import { useDisplay } from '../../context/DisplayContext'
import { useAssistants } from '../../hooks/useAssistants'
import { useComponent } from '../../hooks/useComponent'
import { consts } from '../../utils/consts'
import { trigger } from '../../utils/events'

const SkillEditorPage = () => {
  const { options } = useDisplay()
  const skillEditorIsActive = options.get(consts.EDITOR_ACTIVE_SKILL)
  const { name, skillId } = useParams()
  const { getDist } = useAssistants()
  const { getAllComponents } = useComponent()
  const dist = name ? getDist(name).data : null
  const components = getAllComponents(dist?.name)

  const skillById = components?.data?.skills?.find(
    (s: any) => s?.name === skillId
  )

  // TODO: FIX
  useEffect(() => {
    if (skillId && skillById && !skillEditorIsActive) {
      return trigger('SkillPromptModal', { skill: skillById })
    }

   

    // if (skillId === undefined && skillEditorIsActive)
    //   trigger('SkillPromptModal', { isOpen: false })
  }, [skillId, skillById])

  return (
    <Main sidebar editor>
      <SkillPromptModal />
    </Main>
  )
}

export default SkillEditorPage
