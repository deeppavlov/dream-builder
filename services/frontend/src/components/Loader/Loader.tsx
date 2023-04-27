import { FC } from 'react'
import s from './Loader.module.scss'

interface Props {
  isLoading: boolean
}

export const Loader: FC<Props> = ({ isLoading }) => {
  return <>{isLoading && <div className={s.loader}>Loading...</div>}</>
}
