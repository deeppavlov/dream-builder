import { useState } from 'react'
import { ReactComponent as CPU } from '../../../assets/icons/cpu.svg'
import BaseToolTip from '../../BaseToolTip/BaseToolTip'
import Hint from '../../Hint/Hint'
import s from './BotTab.module.scss'

export const BotTab = () => {
  const [hintIsVisited, setHintIsVisited] = useState<boolean>(
    JSON.parse(`${localStorage.getItem('HINT_IS_VISITED')}`) === true
  )

  const handleBtnClick = () => {
    setHintIsVisited(true)
    localStorage.setItem('HINT_IS_VISITED', JSON.stringify(true))
  }

  return (
    <>
      <button
        data-tooltip-id='sidebarBotTab'
        className={s.cpu}
        onClick={handleBtnClick}>
        <CPU className='activeTab' />

        {hintIsVisited ? (
          <BaseToolTip id='sidebarBotTab' content='Bot' place='right' />
        ) : (
          <Hint id='sidebarBotTab' handleClose={() => setHintIsVisited(true)} />
        )}
      </button>
    </>
  )
}
