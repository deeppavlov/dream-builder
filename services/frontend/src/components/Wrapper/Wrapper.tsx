import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as Close } from '../../assets/icons/close.svg'
import s from './Wrapper.module.scss'

export const Wrapper = ({
  children,
  title,
  alignItems,
  amount,
  linkTo,
  closable,
}: any) => {
  const [visible, setVisible] = useState(true)
  const onClose = () => {
    setVisible(!visible)
  }
  return (
    <>
      {visible && (
        <div style={{ alignItems: `${alignItems}` }} className={s.wrapper}>
          {closable && (
            <button onClick={onClose} className={s.close}>
              <Close/>
            </button>
          )}
          {title || amount ? (
            <div className={s.header}>
              {title ? <h5>{title}</h5> : null}
              {amount > 4 ? (
                <div>
                  <Link to={linkTo}>
                    <button className={s.ghost_btn}>Show&nbsp;All</button>
                  </Link>
                  <span>{amount ? amount : '...'}</span>
                </div>
              ) : null}
            </div>
          ) : null}
          {children}
        </div>
      )}
    </>
  )
}
