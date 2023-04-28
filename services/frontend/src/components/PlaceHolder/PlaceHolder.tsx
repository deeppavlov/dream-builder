import { FC, ReactNode } from 'react'
import s from './PlaceHolder.module.scss'

interface Props {
  children: ReactNode
}

export const Placeholder: FC<Props> = ({ children }) => {
  return <div className={s.placeholder}>{children}</div>
}
