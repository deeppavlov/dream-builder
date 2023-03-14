import React from 'react'
import classNames from 'classnames/bind'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import { ReactComponent as DoneIcon } from '@assets/icons/done.svg'
import { ReactComponent as LoaderIcon } from '@assets/icons/circle_loader_small.svg'
import s from './SmallTag.module.scss'

type Theme =
  | 'default'
  | 'version'
  | 'success'
  | 'error'
  | 'valid'
  | 'validating'
  | 'not-valid'

interface SmallTagProps extends React.PropsWithChildren {
  theme?: Theme
  isLoading?: boolean
}

export const SmallTag = ({ theme, isLoading, children }: SmallTagProps) => {
  let cx = classNames.bind(s)

  const getIcon = (theme?: Theme) => {
    if (!theme) return
    switch (theme) {
      case 'not-valid':
        return <CloseIcon className={s.icon} />
      case 'valid':
        return <DoneIcon className={s.icon} />
      case 'validating':
        return <LoaderIcon className={s.icon} />
      default:
        break
    }
  }

  return (
    <span className={cx('smallTag', theme && theme, isLoading && 'loading')}>
      {getIcon(theme)}
      <span className={s.text}>{children}</span>
    </span>
  )
}
