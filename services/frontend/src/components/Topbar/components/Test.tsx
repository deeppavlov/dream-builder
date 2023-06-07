import classNames from 'classnames/bind'
import { TOOLTIP_DELAY } from '../../../constants/constants'
import { useDisplay } from '../../../context/DisplayContext'
import { consts } from '../../../utils/consts'
import { trigger } from '../../../utils/events'
import { AssistantDialogSidePanel } from '../../AssistantDialogSidePanel/AssistantDialogSidePanel'
import { TRIGGER_RIGHT_SP_EVENT } from '../../BaseSidePanel/BaseSidePanel'
import BaseToolTip from '../../BaseToolTip/BaseToolTip'
import SvgIcon from '../../SvgIcon/SvgIcon'
import s from './Test.module.scss'

export const Test = () => {
  const { options } = useDisplay()
  const activeAssistant = options.get(consts.ACTIVE_ASSISTANT)
  const activePanel = options.get(consts.ACTIVE_ASSISTANT_SP_ID)
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
      data-tooltip-id='chatWithBot'
      className={cx('test', activePanel && 'active')}
      onClick={handleBtnClick}
    >
      <SvgIcon iconName={'chat'} />
      <p>Chat&nbsp;with&nbsp;Assistant</p>
      <BaseToolTip
        delayShow={TOOLTIP_DELAY}
        id='chatWithBot'
        content='Chat with your bot'
      />
    </button>
  )
}
