import { ReactComponent as TabLogo } from '../../../assets/icons/tab.svg'
import s from './AnotherTab.module.scss'

export const AnotherTab = () => {
  return (
    <button className={s.tab}>
      <TabLogo />
    </button>
  )
}
