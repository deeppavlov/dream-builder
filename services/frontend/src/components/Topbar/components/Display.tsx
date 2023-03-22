import { useState } from 'react'
import { ReactComponent as CardsView } from '../../../assets/icons/display.svg'
import { ReactComponent as ListView } from '../../../assets/icons/list-view.svg'
import BaseToolTip from '../../BaseToolTip/BaseToolTip'
import s from './Display.module.scss'

export const Display = ({ viewHandler }: any) => {
  const [view, setView] = useState(false)
  const changeView = () => {
    setView(view => !view)
    viewHandler()
  }
  return (
    <button
      data-tooltip-id='viewType'
      onClick={changeView}
      className={s.display}>
      {!view ? <CardsView /> : <ListView />}
      <BaseToolTip id='viewType' content='Change View Type' />
    </button>
  )
}
