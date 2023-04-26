import { ReactComponent as LoaderIcon } from '@assets/icons/circle_loader_small.svg'
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg'
import { ReactComponent as DoneIcon } from '@assets/icons/done.svg'
import { ReactComponent as PublicIcon } from '@assets/icons/eye.svg'
import { ReactComponent as PrivateIcon } from '@assets/icons/private_eye.svg'
import classNames from 'classnames/bind'
import React, { FC } from 'react'
import s from './SmallTag.module.scss'

type Theme =
  | 'default'
  | 'version'
  | 'success'
  | 'error'
  | 'valid'
  | 'validating'
  | 'not-valid'
  | 'public'
  | 'your'
  | 'public_template'
  | 'unlisted'
  | 'private'

interface SmallTagProps extends React.PropsWithChildren {
  theme?: Theme
  isLoading?: boolean
}

export const SmallTag: FC<SmallTagProps> = ({ theme, isLoading, children }) => {
  let cx = classNames.bind(s)

  const getIcon = (theme?: Theme) => {
    if (!theme) return
    switch (theme) {
      case 'public':
        return <PublicIcon className={s.icon} />
      case 'your':
        return <PrivateIcon className={s.icon} />
      case 'not-valid':
        return <CloseIcon className={s.icon} />
      case 'valid':
        return <DoneIcon className={s.icon} />
      case 'validating':
        return <LoaderIcon className={s.icon} />
      case 'public_template':
        return <PublicIcon className={s.icon} />
      case 'unlisted':
        return <PublicIcon className={s.icon} />
      case 'private':
        return <PrivateIcon className={s.icon} />
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
