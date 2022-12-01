import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as Close } from '../../assets/icons/close.svg'
import s from './Wrapper.module.scss'

export const Wrapper = ({
  amount,
  children,
  linkTo,
  title,
  closable,
  showAll,
  listView,
  ...props
}: any) => {
  const [visible, setVisible] = useState(true)
  const onClose = () => {
    setVisible(!visible)
  }
  return (
    <>
      {visible && (
        <div style={{ ...props }} className={s.wrapper}>
          {closable && (
            <button onClick={onClose} className={s.close}>
              <Close />
            </button>
          )}
          {title || amount ? (
            <div style={listView?{paddingRight:'12px'}:{}} className={s.header}>
              {title ? <h5>{title}</h5> : null}
              {amount > 4 ? (
                <div className={s.btns_area}>
                  {showAll ? (
                    <Link to={linkTo}>
                      <button className={s.ghost_btn}>Show&nbsp;All</button>
                    </Link>
                  ) : (
                    null
                  )}
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
