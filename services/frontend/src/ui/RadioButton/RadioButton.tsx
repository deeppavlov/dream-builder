import { FC, ReactNode } from 'react'
import s from './RadioButton.module.scss'

interface RadioButtonProps {
  children: ReactNode
  name: string
  id: string
  htmlFor: string
  checked?: boolean
  disabled?: boolean
}
export const RadioButton: FC<RadioButtonProps> = ({
  children,
  name,
  id,
  htmlFor,
  checked,
  disabled,
}) => {
  return (
    <div className={s.radio}>
      <input
        disabled={disabled}
        defaultChecked={checked}
        id={id}
        name={name}
        type='radio'
      />
      <label htmlFor={htmlFor} className={s.label}>
        {children}
      </label>
    </div>
  )
}
