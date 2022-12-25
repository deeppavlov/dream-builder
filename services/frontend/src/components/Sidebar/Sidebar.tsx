import ReactTooltip from 'react-tooltip'
import { SettingsTab } from './components/SettingsTab'
import s from './Sidebar.module.scss'

type Props = {
  children?: React.ReactNode
}

export const Sidebar: React.FC<Props> = ({ children }) => {
  return (
    <>
      <div className={s.sidebar}>
        <div className={s.btns_area}>
          {children}
          <ReactTooltip
            id='sidebar_tooltip'
            place='right'
            effect='solid'
            className={s.tooltips}
            delayShow={500}
          />
        </div>
        <SettingsTab />
      </div>
    </>
  )
}
