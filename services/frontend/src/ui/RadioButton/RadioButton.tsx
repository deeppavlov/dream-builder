import s from './RadioButton.module.scss'

interface RadioButtonProps {
  children: React.ReactNode
  name: string
  id: string
  htmlFor: string
  checked?: boolean
}
export const RadioButton: React.FC<RadioButtonProps> = ({
  children,
  name,
  id,
  htmlFor,
  checked,
}) => {
  return (
    <div className={s.radio}>
      <input checked={checked} id={id} name={name} type='radio' />
      <label htmlFor={htmlFor} className={s.radio_label}>
        {children}
      </label>
    </div>
  )
}
