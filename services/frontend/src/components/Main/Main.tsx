import s from './Main.module.scss'

export const Main = ({
  children,
  sidebar,
  title,
  firstLine,
  secondLine,
}: any) => {
  return (
    <div
      style={{
        width: `${sidebar === 'none' ? '100vw' : null}`,
        left: `${sidebar === 'none' ? null : '80px'}`,
      }}
      className={s.main}>
      {title || firstLine || secondLine ? (
        <div>
          {title ? <h5>{title}</h5> : null}
          {firstLine && secondLine ? (
            <p className='b1'>
              {firstLine}
              <br />
              {secondLine}
            </p>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  )
}
