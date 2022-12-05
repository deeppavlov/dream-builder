import s from './Checkbox.module.scss'

export const CheckBox = () => {
  return (
    <label className={s.container}>
      <input type='checkbox' />
      <span className={s.checkmark}></span>
    </label>
  )
}
