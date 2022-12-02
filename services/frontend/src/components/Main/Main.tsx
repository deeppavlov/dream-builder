import s from './Main.module.scss'

export const Main = ({
  children,
  sidebar,
  title,
  firstLine,
  secondLine,
  gap,
  flexDirection,
  alignItems,
  placeItems,
  ...props
}: any) => {
  return (
    <div
      style={{
        gap: `${gap}`,
        width: `${sidebar === 'none' ? '100vw' : null}`,
        left: `${sidebar === 'none' ? null : '80px'}`,
        flexDirection: `${flexDirection}`,
        alignItems: `${alignItems}`,
        placeItems: `${placeItems}`,
        ...props
      }}
      className={s.main}>
      {title || firstLine || secondLine ? (
        <div className={s.info}>
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
