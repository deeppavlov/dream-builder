import { useParams } from 'react-router-dom'
import classNames from 'classnames/bind'
import { usePreview } from '../../context/PreviewProvider'
import Button from '../../ui/Button/Button'
import { ReactComponent as CloneIcon } from '../../assets/icons/clone.svg'
import { trigger } from '../../utils/events'
import { useAuth } from '../../context/AuthProvider'
import s from './AssistantCloneButton.module.scss'
import { useDisplay } from '../../context/DisplayContext'
import { consts } from '../../utils/consts'

export const AssistantCloneButton = () => {
  const auth = useAuth()
  const { isPreview } = usePreview()
  const { options } = useDisplay()
  const activeAssistant = options.get(consts.ACTIVE_ASSISTANT)
  const amount = 42
  let cx = classNames.bind(s)

  const handleCloneBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
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
        props={{ onClick: handleCloneBtnClick }}>
        <CloneIcon />
        <div className={s.container}>
          <span>Clone</span>
          {amount ?? (
            <div className={cx('circle', isPreview ? 'preview' : 'edit')}>
              {amount}
            </div>
          )}
        </div>
      </Button>
    </div>
  )
}
