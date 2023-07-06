import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { useTranslation } from 'react-i18next'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import { SvgIcon } from 'components/Helpers'
import { AssistantDialogSidePanel } from 'components/Panels'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import s from './Test.module.scss'

export const Test = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'topbar.btns' })
  const { UIOptions } = useUIOptions()
  const activeAssistant = UIOptions[consts.ACTIVE_ASSISTANT]
  const activePanel = UIOptions[consts.CHAT_SP_IS_ACTIVE]
  const cx = classNames.bind(s)

  const handleBtnClick = () => {
    activeAssistant &&
      trigger(TRIGGER_RIGHT_SP_EVENT, {
        children: (
          <AssistantDialogSidePanel
            key='chat_with_assistant'
            dist={activeAssistant}
          />
        ),
      })
  }

  return (
    <button
      id='testDialog' // for quitConfirmation
      className={cx('test', activePanel && 'active')}
      onClick={handleBtnClick}
    >
      <SvgIcon iconName={'chat'} />
      <p>{t('chat_with_assistant')}</p>
    </button>
  )
}
