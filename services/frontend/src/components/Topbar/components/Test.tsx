import Play from '../../../assets/icons/test.svg'
import BaseToolTip from '../../BaseToolTip/BaseToolTip'
import s from './Test.module.scss'

export const Test = ({ dialogHandler }: { dialogHandler?: () => void }) => {
  return (
    <button data-tooltip-id='chatWithBot' className={s.test}>
      <img
        src={Play}
        alt='Chat with your bot'
        className={s.test}
        onClick={dialogHandler}
      />
      <BaseToolTip id='chatWithBot' content='Chat with your bot' />
    </button>
  )
}
