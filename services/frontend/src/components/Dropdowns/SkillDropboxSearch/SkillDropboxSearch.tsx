import classNames from 'classnames/bind'
import React, { useRef, useState } from 'react'
import { Control, RegisterOptions, useController } from 'react-hook-form'
import { ReactComponent as ArrowDownIcon } from 'assets/icons/arrow_down.svg'
import { ReactComponent as LoupeIcon } from 'assets/icons/loupe.svg'
import { useObserver } from 'hooks/useObserver'
import s from './SkillDropboxSearch.module.scss'

interface Item {
  id: string
  name: string
  disabled?: boolean
}

interface Props {
  list: Item[]
  name: string
  control: Control<any>
  defaultValue?: string
  rules?: RegisterOptions
  isOpen?: boolean
  label?: string
  props?: React.InputHTMLAttributes<HTMLInputElement>
  fullWidth?: boolean
  withoutSearch?: boolean
  small?: boolean
}

const SkillDropboxSearch = ({
  name,
  control,
  defaultValue,
  rules,
  isOpen: propIsOpen,
  list,
  label,
  props,
  fullWidth,
  withoutSearch,
  small,
}: Props) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules, defaultValue })

  const [isOpen, setIsOpen] = useState(propIsOpen !== undefined)
  const dropboxRef = useRef<HTMLDivElement | null>(null)
  let cx = classNames.bind(s)

  const handleClickOutside = (e: MouseEvent) => {
    if (!dropboxRef.current?.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }

  const handleSearchClick = (e: React.MouseEvent) => {
    const targetIsInput =
      (e.target as HTMLElement).tagName.toLocaleUpperCase() === 'INPUT'
    if (!isOpen && targetIsInput) setIsOpen(true)
    if (!targetIsInput) setIsOpen(prev => !prev)
  }

  const handleItemClick = (item: Item) => {
    field.onChange(item.name)
    setIsOpen(false)
  }

  useObserver('click', handleClickOutside)

  return (
    <div
      ref={dropboxRef}
      className={cx(
        'skillDropboxSearch',
        isOpen && 'open',
        error && 'error',
        fullWidth && 'fullWidth',
        small && 'small'
      )}
      onFocus={() => setIsOpen(true)}
    >
      {label && <span className={s.label}>{label}</span>}

      <div className={s.search} onClick={handleSearchClick}>
        {!withoutSearch && <LoupeIcon className={s.icon} />}
        <input
          {...props}
          {...field}
          value={field.value || ''}
          className={s.input}
          readOnly
        />
        <ArrowDownIcon className={cx('icon', 'arrowDown')} />
      </div>

      <ul className={s.list}>
        {list?.map((item, i) => {
          return (
            <li
              key={i}
              className={cx(
                'item',
                item.name === field.value && 'activeItem',
                item?.disabled && 'disabled'
              )}
              onClick={() => !item?.disabled && handleItemClick(item)}
            >
              {item.name}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default SkillDropboxSearch
