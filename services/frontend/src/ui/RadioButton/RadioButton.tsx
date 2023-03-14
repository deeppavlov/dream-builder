import { FC, ReactNode } from 'react'
import s from './RadioButton.module.scss'

interface RadioButtonProps {
  children: React.ReactNode
  name: string
  id: string | undefined // ???
  htmlFor: string
  checked?: boolean
  disabled?: boolean
  props?: React.InputHTMLAttributes<HTMLInputElement>
  value: string
}
export const RadioButton: FC<RadioButtonProps> = ({
  children,
  name,
  id,
  htmlFor,
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
        value={children?.toString()}
        className={s.radio}
        {...props}
      />
      {children}
    </label>
  )
}
