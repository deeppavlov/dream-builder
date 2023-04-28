import classNames from 'classnames/bind'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
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
  annotation?: string
  onClose?: (e: React.MouseEvent) => void
  forCard?: boolean
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
  annotation,
  onClose,
  forCard,
}: WrapperProps) => {
  const [visible, setVisible] = useState(true)
  const closeRef = useRef<HTMLButtonElement>(null)
  const isStorable = closable && id
  const isCustomClose = onClose && closable
  let cx = classNames.bind(s)

  const handleClose = (e: React.MouseEvent) => {
    if (isStorable)
      localStorage.setItem(`${id}_is_visible`.toUpperCase(), 'false')

    // Return to prevent run is so important! TODO: fix it
    if (isCustomClose) return onClose(e)

    setVisible(false)
  }

  useEffect(() => {
    if (isStorable) {
      const state = localStorage.getItem(`${id}_is_visible`.toUpperCase())
      if (state !== null) setVisible(state === 'true')
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
            skills && 'skills',
            forCard && 'forCard'
          )}
        >
          {closable && (
            <button ref={closeRef} onClick={handleClose} className={s.close}>
              <Close />
            </button>
          )}
          {(title || amount) && (
            <div className={cx('header', annotation && 'annotationFlex')}>
              {title && <h5 className={s.title}>{title}</h5>}
              {annotation && <p className={s.annotation}>{annotation}</p>}
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
