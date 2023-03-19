import Play from '../../../assets/icons/test.svg'
import { trigger } from '../../../utils/events'
import { BASE_SP_EVENT } from '../../BaseSidePanel/BaseSidePanel'
import BaseToolTip from '../../BaseToolTip/BaseToolTip'
import DialogSidePanel from '../../DialogSidePanel/DialogSidePanel'
import s from './Test.module.scss'

export const Test = ({ dialogHandler }: { dialogHandler?: () => void }) => {
  return (
    <button data-tooltip-id='chatWithBot' className={s.test}>
      <img
        src={Play}
        alt='Chat with your bot'
        className={s.test}
        // onClick={dialogHandler}
        onClick={() =>
          trigger(BASE_SP_EVENT, {
            children: <DialogSidePanel key={0} start chatWith='bot' />,
          })
        }
      />
      <BaseToolTip id='chatWithBot' content='Chat with your bot' />
    </button>
  )
}
