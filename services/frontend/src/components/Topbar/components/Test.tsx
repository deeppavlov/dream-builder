import Play from '../../../assets/icons/test.svg'
import { trigger } from '../../../utils/events'
import { BASE_SP_EVENT } from '../../BaseSidePanel/BaseSidePanel'
import BaseToolTip from '../../BaseToolTip/BaseToolTip'
import DialogSidePanel from '../../DialogSidePanel/DialogSidePanel'
import s from './Test.module.scss'

export const Test = () => {
  return (
    <button data-tooltip-id='chatWithBot' className={s.test}>
      <img
        src={Play}
        alt='Play'
        className={s.test}
        onClick={() =>
          trigger(BASE_SP_EVENT, { children: <DialogSidePanel /> })
        }
      />
      <BaseToolTip id='chatWithBot' content='Chat with your bot' />
    </button>
  )
}
