import { useState } from 'react'
import s from './Switcher.module.scss'

interface Props {
  checked?: boolean // False - 0; True - 1
  disabled?: boolean
  label?: React.ReactNode
  switcherLabels?: string[]
}

const Switcher = ({ label, switcherLabels, checked: propChecked, disabled }: Props) => {
  const [checked, setChecked] = useState<boolean>(Boolean(propChecked))

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setChecked(e.target.checked)

  return (
    <label className={s.container}>
      {label}
      <div className={s.switcher}>
        <input
          type='checkbox'
          checked={checked}
          disabled={disabled}
          onChange={handleCheckboxChange}
        />
        <span className={s.switch}>{switcherLabels?.[0] || 0}</span>
        <span className={s.switch}>{switcherLabels?.[1] || 1}</span>
      </div>
    </label>
  )
}

export default Switcher
