import classNames from 'classnames/bind'
import React, { useEffect, useRef, useState } from 'react'
import { ReactComponent as LoupeIcon } from '@assets/icons/loupe.svg'
import { ReactComponent as ArrowDownIcon } from '@assets/icons/arrow_down.svg'
import s from './SkillDropboxSearch.module.scss'

interface Props {
  isOpen?: boolean
  list: string[]
  activeItem?: string
  label?: string
  error?: Partial<{ type: any; message: any }>
  props?: React.InputHTMLAttributes<HTMLInputElement>
  onSelect?: (value: string) => void
}

const SkillDropboxSearch = ({
  isOpen: propIsOpen,
  list,
  activeItem: propActiveItem,
  label,
  error,
  props,
  onSelect,
}: Props) => {
  const [isOpen, setIsOpen] = useState(propIsOpen !== undefined)
  const [activeItem, setActiveItem] = useState<string | null>(
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActiveItem(e.target.value)
  }

  const handleItemClick = (v: string) => {
    setActiveItem(v)
    setIsOpen(false)
    onSelect && onSelect(v)
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div
      ref={dropboxRef}
      className={cx('skillDropboxSearch', isOpen && 'open', error && 'error')}
      onFocus={() => setIsOpen(true)}>
      {label && <span className={s.label}>{label}</span>}

      <div className={s.search} onClick={handleSearchClick}>
        <LoupeIcon className={s.icon} />
        <input
          {...props}
          className={s.input}
          value={activeItem || ''}
          onChange={handleSearchChange}
        />
        <ArrowDownIcon className={cx('icon', 'arrowDown')} />
      </div>

      <ul className={s.list}>
        {list.map((v, i) => (
          <li
            key={i}
            className={cx('item', v === activeItem && 'activeItem')}
            onClick={() => handleItemClick(v)}>
            {v}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SkillDropboxSearch
