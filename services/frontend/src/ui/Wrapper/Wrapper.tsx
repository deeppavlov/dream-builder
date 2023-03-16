import { ReactNode, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import { ReactComponent as Close } from '../../assets/icons/close.svg'
import s from './Wrapper.module.scss'

interface WrapperProps {
  id?: string
  amount?: number | string
  linkTo?: string
  title?: string
  closable?: boolean
  showAll?: boolean
  fullHeight?: boolean
  fitScreen?: boolean
  limiter?: boolean
  primary?: boolean
  skills?: boolean
  children?: ReactNode
}

export const Wrapper = ({
  id,
  amount,
  children,
  linkTo,
  title,
  closable,
  showAll,
  fullHeight,
  fitScreen,
  limiter,
  primary,
  skills,
}: WrapperProps) => {
  const [visible, setVisible] = useState(true)
  let cx = classNames.bind(s)

  const onClose = () => {
    // For store state in localStorage need to get `closable` & `id` props
    if (closable && id) {
      localStorage.setItem(`${id}_is_visible`.toUpperCase(), 'false')
    }

    setVisible(false)
  }

  useEffect(() => {
    if (closable && id) {
      const state = localStorage.getItem(`${id}_is_visible`.toUpperCase())

      if (state !== null) {
        setVisible(state === 'true')
      }
    }
  }, [])

  return (
    <>
      {visible && (
        <div
          className={cx(
            'wrapper',
            fullHeight && 'fullHeight',
            fitScreen && 'fitScreen',
            limiter && 'limiter',
            primary && 'primary',
            skills && 'skills'
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
