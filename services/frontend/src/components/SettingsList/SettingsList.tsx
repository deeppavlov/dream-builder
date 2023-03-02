import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
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
}

export const SettingsList = ({ id, settings, withSelectAll }: Props) => {
  const [isCheckAll, setIsCheckAll] = useState(false)
  const [isCheck, setIsCheck] = useState<string[] | null>(
    settings.filter(({ checked }) => checked).map(({ name }) => name)
  )
  const [list, setList] = useState<SettingKey[] | null>(null)
  let cx = classNames.bind(s)

  useEffect(() => {
    setList(settings)
  }, [list])

  const handleSelectAll = e => {
    setIsCheckAll(!isCheckAll)
    if (list) setIsCheck(list.map(({ name }) => name))
    if (isCheckAll) {
      setIsCheck([])
    }
  }

  const handleCheckboxChange = (e, name) => {
    const { checked } = e.target
    if (!isCheck) return
    setIsCheck([...isCheck, name])
    if (!checked) {
      setIsCheck(isCheck.filter(item => item !== name))
    }
  }

  return (
    <ul className={s.settings}>
      {withSelectAll && (
        <li className={cx('field', 'selectAll')}>
          <Checkbox
            label='Select all'
            onChange={handleSelectAll}
            checked={isCheckAll}
          />
        </li>
      )}
      {list?.map(({ name, type, value, checked }, i) => (
        <li className={cx('field', type === 'radio' && 'selectAll')} key={name + i}>
          {type === 'checkbox' && (
            <Checkbox
              label={name}
              name={name}
              checked={isCheck?.includes(name)}
              onChange={e => handleCheckboxChange(e, name)}
            />
          )}
          {type === 'radio' && (
            <RadioButton
              id={id + name}
              name={id}
              value={name}
              checked={checked}>
              {name}
            </RadioButton>
          )}
          {type === 'switch' && (
            <Switcher checked={checked} label={name} switcherLabels={value} />
          )}
          {type === 'input' && <SmallInput label={name} value={value} />}
        </li>
      ))}
    </ul>
  )
}
