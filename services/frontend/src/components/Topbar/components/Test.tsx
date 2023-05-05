import Play from '../../../assets/icons/test.svg'
import { TOOLTIP_DELAY } from '../../../constants/constants'
import { useDisplay } from '../../../context/DisplayContext'
import { consts } from '../../../utils/consts'
import { trigger } from '../../../utils/events'
import { TRIGGER_RIGHT_SP_EVENT } from '../../BaseSidePanel/BaseSidePanel'
import BaseToolTip from '../../BaseToolTip/BaseToolTip'
import DialogSidePanel from '../../DialogSidePanel/DialogSidePanel'
import s from './Test.module.scss'

export const Test = () => {
  const { options } = useDisplay()
  const activeAssistant = options.get(consts.ACTIVE_ASSISTANT)

  const handleBtnClick = () => {
    trigger(TRIGGER_RIGHT_SP_EVENT, {
      children: (
        <DialogSidePanel
          debug={false}
          key='chat_with_assistant'
          chatWith='bot'
          // start
          dist={activeAssistant}
        />
      ),
    })
  }

  return (
    <button data-tooltip-id='chatWithBot' className={s.test}>
      <img
        src={Play}
        alt='Chat with your bot'
        className={s.test}
        onClick={handleBtnClick}
      />
      <BaseToolTip
        delayShow={TOOLTIP_DELAY}
        id='chatWithBot'
        content='Chat with your bot'
      />
    </button>
  )
}
