import classNames from 'classnames/bind'
import { useDisplay } from 'context'
import { TOOLTIP_DELAY } from 'constants/constants'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import { SvgIcon } from 'components/Helpers'
import { BaseToolTip } from 'components/Menus'
import { AssistantDialogSidePanel } from 'components/Panels'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import s from './Test.module.scss'

export const Test = () => {
  const { options } = useDisplay()
  const activeAssistant = options.get(consts.ACTIVE_ASSISTANT)
  const activePanel = options.get(consts.CHAT_SP_IS_ACTIVE)
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
