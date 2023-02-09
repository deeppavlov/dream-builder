import { useState } from 'react'
import { ReactComponent as CheckBoxMarkIcon } from '@assets/icons/checkbox_mark.svg'
import s from './Checkbox.module.scss'

interface Props {
  disabled?: boolean
  checked?: boolean
  label?: React.ReactNode
}

export const Checkbox = ({ label, checked: propChecked, disabled }: Props) => {
  const [checked, setChecked] = useState<boolean>(Boolean(propChecked))

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setChecked(e.target.checked)

  return (
    <label className={s.container}>
      <div className={s.checkbox}>
        <input
          type='checkbox'
          checked={checked}
          disabled={disabled}
          onChange={handleCheckboxChange}
        />
        <CheckBoxMarkIcon className={s.checkmark} />
      </div>

      {label}
    </label>
  )
}
