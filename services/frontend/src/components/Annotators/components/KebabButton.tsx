import s from './KebabButton.module.scss'
export const KebabButton = ({ type, color }: any) => {
  return (
    <button style={{ flexDirection: `${type}` }} className={s.kebab}>
      <figure
        style={{ backgroundColor: `${color}` }}
        className={s.dots}></figure>
      <figure
        style={{ backgroundColor: `${color}` }}
        className={s.dots}></figure>
      <figure
        style={{ backgroundColor: `${color}` }}
        className={s.dots}></figure>
    </button>
  )
}
