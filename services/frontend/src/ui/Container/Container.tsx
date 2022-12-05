import s from './Container.module.scss'

export const Container = props => {
  return (
    <div
      style={{
        ...props,
      }}
      className={s.container}>
      {props.children}
    </div>
  )
}
