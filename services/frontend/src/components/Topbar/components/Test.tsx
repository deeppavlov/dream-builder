import { ReactComponent as PlayIcon } from '@assets/icons/chatting.svg'
import { TOOLTIP_DELAY } from '../../../constants/constants'
import { useDisplay } from '../../../context/DisplayContext'
import { consts } from '../../../utils/consts'
import { trigger } from '../../../utils/events'
import { AssistantDialogSidePanel } from '../../AssistantDialogSidePanel/AssistantDialogSidePanel'
import { TRIGGER_RIGHT_SP_EVENT } from '../../BaseSidePanel/BaseSidePanel'
import BaseToolTip from '../../BaseToolTip/BaseToolTip'
import s from './Test.module.scss'

export const Test = () => {
  const { options } = useDisplay()
  const activeAssistant = options.get(consts.ACTIVE_ASSISTANT)

  const handleBtnClick = () => {
    trigger(TRIGGER_RIGHT_SP_EVENT, {
      children: (
        <AssistantDialogSidePanel
          debug={false}
          key='chat_with_assistant'
          chatWith='bot'
          dist={activeAssistant}
        />
      ),
    })
  }

  return (
    <button
      id='testDialog'
      data-tooltip-id='chatWithBot'
      className={s.test}
      onClick={handleBtnClick}
    >
      <PlayIcon />
      <BaseToolTip
        delayShow={TOOLTIP_DELAY}
        id='chatWithBot'
        content='Chat with your bot'
      />
    </button>
  )
}
