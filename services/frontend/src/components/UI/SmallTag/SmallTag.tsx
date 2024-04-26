import classNames from 'classnames/bind'
import React, { FC } from 'react'
import { ReactComponent as LoaderIcon } from 'assets/icons/circle_loader_small.svg'
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg'
import { ReactComponent as DoneIcon } from 'assets/icons/done.svg'
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg'
import { ReactComponent as PublicIcon } from 'assets/icons/eye.svg'
import { ReactComponent as PrivateIcon } from 'assets/icons/private_eye.svg'
import { VISIBILITY_STATUS } from 'constants/constants'
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
  | 'PUBLIC_TEMPLATE' //fix
  | 'UNLISTED_LINK'
  | 'PRIVATE'
  | 'not_built'
  | 'building'
  | 'ready'

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
      case 'ready':
        return <DoneIcon className={s.icon} />
      case 'validating':
      case 'building':
        return <LoaderIcon className={s.icon} />
      case VISIBILITY_STATUS.PUBLIC_TEMPLATE:
        return <PublicIcon className={s.icon} />
      case VISIBILITY_STATUS.UNLISTED_LINK:
        return <PublicIcon className={s.icon} />
      case VISIBILITY_STATUS.PRIVATE:
        return <PrivateIcon className={s.icon} />
      case 'not_built':
        return <EditIcon className={s.icon} />
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
