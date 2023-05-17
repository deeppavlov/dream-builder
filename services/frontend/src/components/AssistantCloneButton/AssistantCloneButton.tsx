import { ReactComponent as CloneIcon } from '../../assets/icons/clone.svg'
import { useAuth } from '../../context/AuthProvider'
import { useDisplay } from '../../context/DisplayContext'
import { usePreview } from '../../context/PreviewProvider'
import Button from '../../ui/Button/Button'
import { consts } from '../../utils/consts'
import { trigger } from '../../utils/events'
import s from './AssistantCloneButton.module.scss'

export const AssistantCloneButton = () => {
  const auth = useAuth()
  const { isPreview } = usePreview()
  const { options } = useDisplay()
  const activeAssistant = options.get(consts.ACTIVE_ASSISTANT)
  const userIsAuthorized = !!auth?.user

  const handleCloneBtnClick = () => {
    const assistantClone = {
      action: 'clone',
      bot: activeAssistant,
      from: 'editor',
    }
    if (!userIsAuthorized)
      return trigger('SignInModal', {
        requestModal: { name: 'AssistantModal', options: assistantClone },
      })

    trigger('AssistantModal', assistantClone)
  }

  return (
    <Button
      theme={isPreview ? 'primary' : 'secondary'}
      small
      withIcon
      clone
      props={{ onClick: handleCloneBtnClick }}
    >
      <div className={s.btn}>
        <CloneIcon className={s.icon} />
        <span>Use</span>
      </div>
    </Button>
  )
}
