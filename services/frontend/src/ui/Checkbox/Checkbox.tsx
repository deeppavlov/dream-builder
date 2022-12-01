import s from './Checkbox.module.scss'

export const Checkbox = () => {
  return (
    <label className={s.container}>
      <input type='checkbox' />
      <span className={s.checkmark} />
    </label>
  )
}
