import classNames from 'classnames/bind'
import React, { useEffect, useRef, useState } from 'react'
import { ReactComponent as LoupeIcon } from '@assets/icons/loupe.svg'
import { ReactComponent as ArrowDownIcon } from '@assets/icons/arrow_down.svg'
import { Input } from '../../ui/Input/Input'
import s from './SkillDropboxSearch.module.scss'

interface Props {
  placeholder: string
  list: string[]
  activeItem?: string
  onSelect?: (value: string) => void
}

const SkillDropboxSearch = ({
  placeholder,
  list,
  activeItem: propActiveItem,
  onSelect,
}: Props) => {
  let cx = classNames.bind(s)
  const [isOpen, setIsOpen] = useState(true)
  const [activeItem, setActiveItem] = useState<string | null>(
    propActiveItem ?? null
  )
  const dropboxRef = useRef<HTMLDivElement | null>(null)

  const handleClickOutside = (e: MouseEvent) => {
    if (isOpen && !dropboxRef.current?.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }

  const handleDropboxClick = (e: React.MouseEvent) => {
    const targetIsInput =
      (e.target as HTMLElement).tagName.toLocaleUpperCase() === 'INPUT'

    if (!isOpen && targetIsInput) setIsOpen(true)
    if (!targetIsInput) setIsOpen(!isOpen)
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
      className={cx('skillDropboxSearch', isOpen && 'isOpen')}>
      <div className={cx('search')} onClick={handleDropboxClick}>
        <LoupeIcon className={cx('icon')} />
        <Input
          key={activeItem}
          props={{ value: activeItem || '', placeholder }}
        />
        <ArrowDownIcon className={cx('icon', 'arrowDown')} />
      </div>
      <ul className={cx('list')}>
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
