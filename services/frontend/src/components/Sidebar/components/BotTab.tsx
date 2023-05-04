import { useState } from 'react'
import { ReactComponent as CPU } from '../../../assets/icons/cpu.svg'
import { TOOLTIP_DELAY } from '../../../constants/constants'
import BaseToolTip from '../../BaseToolTip/BaseToolTip'
import Hint from '../../Hint/Hint'
import s from './BotTab.module.scss'

export const BotTab = () => {
  const hintName = 'ArchitectureTab'
  const [hintIsVisited, setHintIsVisited] = useState<boolean>(
    JSON.parse(`${localStorage.getItem(`${hintName}_IS_VISITED`)}`) === true
  )

  const handleBtnClick = () => {
    setHintIsVisited(true)
    localStorage.setItem(`${hintName}_IS_VISITED`, JSON.stringify(true))
  }

  return (
    <>
      <button
        data-tooltip-id='sidebarBotTab'
        className={s.cpu}
        onClick={handleBtnClick}
      >
        <CPU className='activeTab' />

        {hintIsVisited ? (
          <BaseToolTip
            delayShow={TOOLTIP_DELAY}
            id='sidebarBotTab'
            content='Bot'
            place='right'
          />
        ) : (
          <Hint
            tooltipId='sidebarBotTab'
            name={hintName}
            text={
              <>
                Click here to control your Virtual Assistant: <br />
                annotators, skill & response selectors, and skills.
              </>
            }
            handleClose={() => setHintIsVisited(true)}
          />
        )}
      </button>
    </>
  )
}
