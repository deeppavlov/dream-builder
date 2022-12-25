import { CSSProperties, ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as Close } from '../../assets/icons/close.svg'
import s from './Wrapper.module.scss'

interface WrapperProps {
  amount?: number | string
  linkTo?: string
  title?: string
  closable?: true
  showAll?: true
  styles?: CSSProperties
  children?: ReactNode
}

export const Wrapper = ({
  amount,
  children,
  linkTo,
  title,
  closable,
  showAll,
  styles,
}: WrapperProps) => {
  const [visible, setVisible] = useState(true)
  const onClose = () => {
    setVisible(!visible)
  }
  return (
    <>
      {visible && (
        <div style={styles} className={s.wrapper}>
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
                    <Link to={linkTo}>
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
