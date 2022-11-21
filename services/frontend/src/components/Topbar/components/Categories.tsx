import { useRef, useState } from 'react'
import { useCheckClickOutside } from '../../../hooks/useCheckClickOutside'
import { ReactComponent as Arrow } from '../../../assets/icons/arrow_left.svg'
import s from './Categories.module.scss'

export const Categories = () => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useCheckClickOutside(open, ref, setOpen)
  const handleOpen = () => {
    setOpen(!open)
  }
  const handleClick = () => {
    console.log('clicked!')
  }
  return (
    <div ref={ref} className={s.dropdown} onClick={handleOpen}>
      <i className={s.arrow} />
      <div className={s.categories}>All Categories</div>
      {open ? (
        <div className={s.menu}>
          <ul>
            <li className={s.item}>
              <button onClick={handleClick}>
                <Arrow />
                Size
              </button>
            </li>
            <li className={s.item}>
              <button onClick={handleClick}>
                <Arrow />
                Language
              </button>
            </li>
            <li className={s.item}>
              <button onClick={handleClick}>
                <Arrow />
                Type
              </button>
            </li>
            <li className={s.item}>
              <button onClick={handleClick}>
                <Arrow />
                Source
              </button>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  )
}
