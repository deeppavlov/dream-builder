import { FC, ReactNode } from 'react'
import s from './RadioButton.module.scss'

interface RadioButtonProps {
  children: React.ReactNode
  name: string
  id: string
  htmlFor: string
  value: string
  checked?: boolean
  disabled?: boolean
  props?: React.InputHTMLAttributes<HTMLInputElement>
}
export const RadioButton: FC<RadioButtonProps> = ({
  children,
  name,
  id,
  htmlFor,
  value,
  checked,
  disabled,
  props,
}) => {
  return (
    <label htmlFor={htmlFor} className={s.label}>
      <input
        id={id}
        name={name}
        type='radio'
        disabled={disabled}
        defaultChecked={checked}
        checked={checked}
        value={value}
        className={s.radio}
        {...props}
      />
      {children}
    </label>
  )
}
