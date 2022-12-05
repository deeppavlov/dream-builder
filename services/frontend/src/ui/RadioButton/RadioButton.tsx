import s from './RadioButton.module.scss'

export const RadioButton = () => {
  return (
    <div className={s.radio}>
      <input id='radio-1' name='radio' type='radio' />
      <label htmlFor='radio-1' className={s.radio_label} />
    </div>
  )
}
