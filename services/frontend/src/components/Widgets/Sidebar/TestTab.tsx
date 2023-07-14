import { ReactComponent as TabLogo } from 'assets/icons/tab.svg'
import s from './TestTab.module.scss'

export const TestTab = () => {
  return (
    <button
      disabled
      data-tip='Training'
      data-for='sidebar_tooltip'
      className={s.tab}
    >
      <TabLogo />
    </button>
  )
}
