import classNames from 'classnames/bind'
import React, { useRef, useState } from 'react'
import { ReactComponent as LoupeIcon } from '@assets/icons/loupe.svg'
import { ReactComponent as ArrowDownIcon } from '@assets/icons/arrow_down.svg'
import { useObserver } from '../../hooks/useObserver'
import s from './SkillDropboxSearch.module.scss'

interface Item {
  name: string
  data?: any
}

interface Props {
  isOpen?: boolean
  list: Item[]
  activeItem?: Item
  label?: string
  error?: Partial<{ type: any; message: any }>
  props?: React.InputHTMLAttributes<HTMLInputElement>
  onSelect?: (item: Item) => void
  fullWidth?: boolean
}

const SkillDropboxSearch = ({
  isOpen: propIsOpen,
  list,
  activeItem: propActiveItem,
  label,
  error,
  props,
  fullWidth,
  onSelect,
}: Props) => {
  const [isOpen, setIsOpen] = useState(propIsOpen !== undefined)
  const [activeItem, setActiveItem] = useState<Item | null>(
    propActiveItem ?? null
  )
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
    if (!targetIsInput) setIsOpen(!isOpen)
  }

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   props?.onChange && props.onChange(e)
  //   setActiveItem(e.target.value)
  // }

  const handleItemClick = (item: Item) => {
    setActiveItem(item)
    setIsOpen(false)
    onSelect && onSelect(item)
  }

  useObserver('click', handleClickOutside)

  return (
    <div
      ref={dropboxRef}
      className={cx(
        'skillDropboxSearch',
        isOpen && 'open',
        error && 'error',
        fullWidth && 'fullWidth'
      )}
      onFocus={() => setIsOpen(true)}
    >
      {label && <span className={s.label}>{label}</span>}

      <div className={s.search} onClick={handleSearchClick}>
        <LoupeIcon className={s.icon} />
        <input
          {...props}
          className={s.input}
          // onChange={handleSearchChange}
        />
        <ArrowDownIcon className={cx('icon', 'arrowDown')} />
      </div>

      <ul className={s.list}>
        {list.map((item, i) => (
          <li
            key={i}
            className={cx(
              'item',
              item.name === activeItem?.name && 'activeItem'
            )}
            onClick={() => handleItemClick(item)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SkillDropboxSearch
