import s from './RadioButton.module.scss'

interface RadioButtonProps {
  children: React.ReactNode
  name: string
  id: string
  value: string
  htmlFor: string
  checked: boolean
}
export const RadioButton: React.FC<Partial<RadioButtonProps>> = ({
  children,
  name,
  id,
  htmlFor,
  value,
  checked,
}) => {
  return (
    <label htmlFor={htmlFor} className={s.label}>
      <input
        className={s.radio}
        value={value}
        checked={checked}
        id={id}
        name={name}
        type='radio'
      />
      {children}
    </label>
  )
}
