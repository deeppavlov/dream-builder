import { ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as Close } from '../../assets/icons/close.svg'
import s from './Wrapper.module.scss'
import classNames from 'classnames/bind'

interface WrapperProps {
  amount?: number | string
  linkTo?: string
  title?: string
  closable?: boolean
  showAll?: boolean
  fullHeight?: boolean
  fitScreen?: boolean
  limiter?: boolean
  children?: ReactNode
}

export const Wrapper = ({
  amount,
  children,
  linkTo,
  title,
  closable,
  showAll,
  fullHeight,
  fitScreen,
  limiter,
}: WrapperProps) => {
  const [visible, setVisible] = useState(true)
  const onClose = () => {
    setVisible(!visible)
  }
  let cx = classNames.bind(s)
  return (
    <>
      {visible && (
        <div
          className={cx(
            'wrapper',
            fullHeight && 'fullHeight',
            fitScreen && 'fitScreen',
            limiter && 'limiter'
          )}>
          {closable && (
            <button onClick={onClose} className={s.close}>
              <Close />
            </button>
          )}
          {(title || amount) && (
            <div className={s.header}>
              {title && <h5 className={s.title}>{title}</h5>}
              {amount && (
                <div className={s.btns_area}>
                  {showAll && (
                    <Link to={linkTo!}>
                      <button className={s.ghost_btn}>Show&nbsp;All</button>
                    </Link>
                  )}
                  <span className={s.amount}>{amount || '...'}</span>
                </div>
              )}
            </div>
          )}
          {children}
        </div>
      )}
    </>
  )
}
