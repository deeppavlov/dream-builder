import { useState } from 'react'
import { ReactComponent as CardsView } from '../../../assets/icons/display.svg'
import { ReactComponent as ListView } from '../../../assets/icons/list-view.svg'
import s from './Display.module.scss'

export const Display = () => {
  const [view, setView] = useState(false)
  const changeView = () => {
    setView(!view)
  }
  return (
    <button onClick={changeView} className={s.display}>
      {view ? <CardsView /> : <ListView />}
    </button>
  )
}
