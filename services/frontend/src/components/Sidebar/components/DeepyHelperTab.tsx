import DeepyHelperIcon from '@assets/icons/deepy_helper.png'
import classNames from 'classnames/bind'
import { useState } from 'react'
import { TOOLTIP_DELAY } from '../../../constants/constants'
import { useDisplay } from '../../../context/DisplayContext'
import { consts } from '../../../utils/consts'
import { trigger } from '../../../utils/events'
import { TRIGGER_LEFT_SP_EVENT } from '../../BaseSidePanel/BaseSidePanel'
import BaseToolTip from '../../BaseToolTip/BaseToolTip'
import { CopilotSidePanel } from '../../CopilotSidePanel/CopilotSidePanel'
import Hint from '../../Hint/Hint'
import s from './DeepyHelperTab.module.scss'

export const HELPER_TAB_ID = 'helperTab'

export const DeepyHelperTab = () => {
  const { options } = useDisplay()
  const copilotIsActive = options.get(consts.COPILOT_SP_IS_ACTIVE)
  const [hintIsVisited, setHintIsVisited] = useState<boolean>(
    JSON.parse(`${localStorage.getItem(`${HELPER_TAB_ID}_IS_VISITED`)}`) ===
      true
  )
  let cx = classNames.bind(s)

  const handleBtnClick = () => {
    trigger(TRIGGER_LEFT_SP_EVENT, {
      children: <CopilotSidePanel />,
      isOpen: !copilotIsActive,
    })
    setHintIsVisited(true)
    localStorage.setItem(`${HELPER_TAB_ID}_IS_VISITED`, JSON.stringify(true))
  }

  return (
    <button
      id={HELPER_TAB_ID}
      data-tooltip-id={HELPER_TAB_ID}
      className={cx('icon', copilotIsActive && 'active')}
      onClick={handleBtnClick}
    >
      <img src={DeepyHelperIcon} alt='Deepy' />

      {hintIsVisited ? (
        <BaseToolTip
          delayShow={TOOLTIP_DELAY}
          id={HELPER_TAB_ID}
          content='Deepy'
          place='right'
        />
      ) : (
        <Hint
          tooltipId={HELPER_TAB_ID}
          name={HELPER_TAB_ID}
          text={<>Click here if you need help with prompt</>}
          handleClose={() => setHintIsVisited(true)}
        />
      )}
    </button>
  )
}
