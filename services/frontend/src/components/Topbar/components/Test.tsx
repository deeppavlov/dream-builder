import { ReactComponent as Play } from '../../../assets/icons/test.svg'
import s from './Test.module.scss'

export const Test = () => {
  return (
    <button data-tip='Chat With Your Bot' className={s.test}>
      <Play />
    </button>
  )
}
