import { Link } from 'react-router-dom'
import s from './Wrapper.module.scss'

export const Wrapper = ({
  children,
  title,
  alignItems,
  amount,
  linkTo,
}: any) => {
  return (
    <div style={{ alignItems: `${alignItems}` }} className={s.wrapper}>
      {title || amount ? (
        <div className={s.header}>
          {title ? <h5>{title}</h5> : null}
          {amount > 4 ? (
            <div>
              <Link to={linkTo}>
                <button>Show&nbsp;All</button>
              </Link>
              <span>{amount ? amount : '...'}</span>
            </div>
          ) : null}
        </div>
      ) : null}

      {children}
    </div>
  )
}
