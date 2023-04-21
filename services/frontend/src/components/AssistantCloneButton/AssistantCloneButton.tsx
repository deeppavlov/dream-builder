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

  const handleCloneBtnClick = () => {
    if (!auth?.user) {
      trigger('SignInModal', {})
      return
    }

    trigger('AssistantModal', {
      action: 'clone',
      bot: activeAssistant,
      from: 'editor',
    })
  }

  return (
    <div className={s.clone}>
      <Button
        theme={isPreview ? 'primary' : 'secondary'}
        small
        withIcon
        clone
        props={{ onClick: handleCloneBtnClick }}
      >
        <CloneIcon />
        <div className={s.container}>
          <span>Make&nbsp;Copy</span>
        </div>
      </Button>
    </div>
  )
}
