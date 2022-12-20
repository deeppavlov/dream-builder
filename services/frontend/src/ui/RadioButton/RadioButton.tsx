import s from './RadioButton.module.scss'

export const RadioButton = ({ children, name, id, htmlFor }: any) => {
  return (
    <div className={s.radio}>
      <input id={id} name={name} type='radio' />
      <label htmlFor={htmlFor} className={s.radio_label}>
        {children}
      </label>
    </div>
  )
}
