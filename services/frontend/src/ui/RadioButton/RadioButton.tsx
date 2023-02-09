import { useState } from 'react'
import s from './RadioButton.module.scss'

interface RadioButtonProps {
  children: React.ReactNode
  name: string
  id: string
  htmlFor: string
  checked: boolean
}
export const RadioButton: React.FC<Partial<RadioButtonProps>> = ({
  children,
  name,
  id,
  htmlFor,
  checked: propChecked,
}) => {
  // const [checked, setChecked] = useState<boolean>(Boolean(propChecked))

  // const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  //   setChecked(e.target.checked)

  return (
    <label htmlFor={htmlFor} className={s.label}>
      <input
        className={s.radio}
        value={id}
        checked={propChecked}
        id={id}
        name={name}
        type='radio'
        // onChange={handleRadioChange}
      />
      {children}
    </label>
  )
}
