import s from './Container.module.scss'

export const Container = ({
  children,
  justifyContent,
  flexDirection,
  overflowX,
  flexWrap,
}: any) => {
  return (
    <div
      style={{
        flexWrap: `${flexWrap}`,
        justifyContent: `${justifyContent}`,
        flexDirection: `${flexDirection}`,
      }}
      className={s.container}>
      {children}
    </div>
  )
}
