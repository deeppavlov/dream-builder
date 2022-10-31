import s from './Container.module.scss'

export const Container = ({
  children,
  position,
  flexDirection,
  overflowX,
  flexWrap,
}: any) => {
  return (
    <div
      style={{
        flexWrap: `${flexWrap}`,
        justifyContent: `${position}`,
        flexDirection: `${flexDirection}`,
      }}
      className={s.container}>
      {children}
    </div>
  )
}
