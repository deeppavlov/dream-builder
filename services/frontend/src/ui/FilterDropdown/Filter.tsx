import { useEffect, useRef, useState } from 'react'
import { useCheckClickOutside } from '../../hooks/useCheckClickOutside'
import s from './Filter.module.scss'

export const Filter = () => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  // useCheckClickOutside(open, ref, setOpen)
  const handleOpen = () => {
    setOpen(!open)
  }
  const handleClick = (event: any) => {
    event?.stopPropagation()
    console.log('clicked!')
  }
  return (
    <div ref={ref} className={s.dropdown} onClick={handleOpen}>
      <i className={s.arrow} />
      <div className={s.categories}>Filter By</div>
      {open ? (
        <div className={s.menu}>
          <ul>
            <form>
              <li onClick={handleClick} className={s.item}>
                <label>
                  <input type='checkbox' />
                  <span>???</span>
                </label>
              </li>
              <li onClick={handleClick} className={s.item}>
                <label>
                  <input type='checkbox' />
                  <span>???</span>
                </label>
              </li>
              <li onClick={handleClick} className={s.item}>
                <label>
                  <input type='checkbox' />
                  <span>???</span>
                </label>
              </li>
              <li onClick={handleClick} className={s.item}>
                <label>
                  <input type='checkbox' />
                  <span>???</span>
                </label>
              </li>
            </form>
          </ul>
        </div>
      ) : null}
    </div>
  )
}
