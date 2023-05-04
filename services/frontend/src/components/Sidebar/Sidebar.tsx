import { FC } from 'react'
import s from './Sidebar.module.scss'

type Props = {
  children?: React.ReactNode
}

export const Sidebar: FC<Props> = ({ children }) => (
  <div className={s.sidebar}>
    <div className={s.btns_area}>{children}</div>
  </div>
)
