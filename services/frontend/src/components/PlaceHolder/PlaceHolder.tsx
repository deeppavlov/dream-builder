import classNames from 'classnames/bind'
import { FC, ReactNode } from 'react'
import s from './PlaceHolder.module.scss'

interface Props {
  children: ReactNode
  type?: 'table'
}

export const Placeholder: FC<Props> = ({ children, type }) => {
  const cx = classNames.bind(s)
  return (
    <>
      {type !== 'table' ? (
        <div className={cx('placeholder')}>{children}</div>
      ) : (
        <tbody>
          <tr className={s.placeholderTable}>
            <td colSpan={6}>{children}</td>
          </tr>
        </tbody>
      )}
    </>
  )
}
