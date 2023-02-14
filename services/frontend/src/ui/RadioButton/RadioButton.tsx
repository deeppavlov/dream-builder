import { FC, ReactNode } from 'react'
import s from './RadioButton.module.scss'

interface RadioButtonProps {
  children: React.ReactNode
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
    <label htmlFor={htmlFor} className={s.label}>
      <input
        className={s.radio}
        disabled={disabled}
        defaultChecked={checked}
        id={id}
        name={name}
        type='radio'
      />
      {children}
    </label>
  )
}
