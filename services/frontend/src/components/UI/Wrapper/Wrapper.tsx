import classNames from 'classnames/bind'
import { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ReactComponent as Close } from 'assets/icons/close.svg'
import { Badge } from 'components/UI'
import s from './Wrapper.module.scss'

interface Props {
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
  subWrapper?: boolean
  btns?: ReactNode
  badge?: boolean
  table?: boolean
}

export const Wrapper: FC<Props> = ({
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
  subWrapper,
  btns,
  badge,
  table,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'home_page.wrapper',
  })
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
            forCard && 'forCard',
            table && 'forTable'
            // subWrapper && 'subWrapper'
          )}
        >
          {badge && <Badge />}
          {closable && (
            <button ref={closeRef} onClick={handleClose} className={s.close}>
              <Close />
            </button>
          )}
          {(title || amount) && (
            <div className={cx('header', annotation && 'annotationFlex')}>
              {title && <h5 className={s.title}>{title}</h5>}

              {!subWrapper && (
                <>
                  {amount && (
                    <div className={s.btns_area}>
                      {showAll && (
                        <Link to={linkTo!}>
                          <button className={s.ghost_btn}>
                            {t('links.show_all')}
                          </button>
                        </Link>
                      )}
                      <span className={s.amount}>{amount || '...'}</span>
                    </div>
                  )}
                  {btns && <div className={s.btns_area}>{btns}</div>}
                </>
              )}
            </div>
          )}
          {annotation && <p className={s.annotation}>{annotation}</p>}
          {!subWrapper && children}
          {subWrapper && (
            <div className={cx('wrapper', 'subWrapper')}>
              <div className={s.header}>
                <p className={s.annotation}>{t('subwrapper')}</p>
                {amount && (
                  <div className={s.btns_area}>
                    {showAll && (
                      <Link to={linkTo!}>
                        <button className={s.ghost_btn}>
                          {t('links.show_all')}
                        </button>
                      </Link>
                    )}
                    <span className={s.amount}>{amount || '...'}</span>
                  </div>
                )}
              </div>
              {children}
            </div>
          )}
        </div>
      )}
    </>
  )
}
