import s from './Container.module.scss'

export const Container = ({
  children,
  justifyContent,
  flexDirection,
  flexWrap,
  height,
}: any) => {
  return (
    <div
      style={{
        height: `${height}`,
        flexWrap: `${flexWrap}`,
        justifyContent: `${justifyContent}`,
        flexDirection: `${flexDirection}`,
      }}
      className={s.container}>
      {children}
    </div>
  )
}
