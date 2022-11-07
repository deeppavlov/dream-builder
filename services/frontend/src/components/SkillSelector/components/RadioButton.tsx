import s from './RadioButton.module.scss'

export const RadioButton = () => {
  return (
    <label className={s.container}>
      <input type='checkbox' />
      <span className={s.checkmark}></span>
    </label>
  )
}
