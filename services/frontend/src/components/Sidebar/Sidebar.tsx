import { Tooltip as ReactTooltip } from 'react-tooltip'
import { SettingsTab } from './components/SettingsTab'
import s from './Sidebar.module.scss'

type Props = {
  children?: React.ReactNode
}

export const Sidebar: React.FC<Props> = ({ children }) => (
  <div className={s.sidebar}>
    <div className={s.btns_area}>{children}</div>
  </div>
)
