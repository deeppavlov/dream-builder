import { FC } from 'react'
import s from './Details.module.scss'

interface Props {
  children: string
}

export const Details: FC<Props> = ({ children }) => {
  return (
    <div className={s.details}>
      {/* <span className={s.header}>Details:</span> */}
      <span className={s.body}>{children}</span>
    </div>
  )
}
