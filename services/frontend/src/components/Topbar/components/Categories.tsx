import { useRef, useState } from 'react'
import { useCheckClickOutside } from '../../../hooks/useCheckClickOutside'
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
              <button onClick={handleClick}>Size</button>
            </li>
            <li className={s.item}>
              <button onClick={handleClick}>Language</button>
            </li>
            <li className={s.item}>
              <button onClick={handleClick}>Type</button>
            </li>
            <li className={s.item}>
              <button onClick={handleClick}>Source</button>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  )
}
