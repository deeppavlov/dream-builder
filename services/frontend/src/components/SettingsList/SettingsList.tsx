import classNames from 'classnames/bind'
import { useEffect } from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import { SettingKey } from '../../types/types'
import { Checkbox } from '../../ui/Checkbox/Checkbox'
import { RadioButton } from '../../ui/RadioButton/RadioButton'
import SmallInput from '../../ui/SmallInput/SmallInput'
import Switcher from '../../ui/Switcher/Switcher'
import s from './SettingsList.module.scss'

interface Props {
  id: string
  settings: SettingKey[]
  withSelectAll?: boolean
  register?: UseFormRegister<FieldValues>
}

export const SettingsList = ({
  id,
  settings,
  withSelectAll,
  register,
}: Props) => {
  let cx = classNames.bind(s)

  return (
    <ul className={s.settings}>
      {withSelectAll && (
        <li className={cx('field', 'selectAll')}>
          <Checkbox label='Select all' props={{ ...register?.('selectAll') }} />
        </li>
      )}
      {settings?.map(({ name, type, value, checked }, i) => (
        <li className={s.field} key={name + i}>
          {type === 'checkbox' && (
            <Checkbox
              label={name}
              name={name}
              /**
               * Dot symbol "." in register name can make the object of elements, like:
               * checkbox: {
               *   [name]: value
               * }
               */
              props={{ ...register?.(`checkbox.${name}`) }}
            />
          )}
          {type === 'radio' && (
            <RadioButton
              id={id + name}
              name={id}
              htmlFor={id + name}
              checked={checked}
              props={{ ...register?.('radio', { required: true }) }}>
              {name}
            </RadioButton>
          )}
          {type === 'switch' && (
            <Switcher
              label={name}
              switcherLabels={value}
              props={{ ...register?.(`switch.${name}`) }}
            />
          )}
          {type === 'input' && (
            <SmallInput
              label={name}
              value={value}
              props={{ ...register?.(`input.${name}`) }}
            />
          )}
        </li>
      ))}
    </ul>
  )
}
