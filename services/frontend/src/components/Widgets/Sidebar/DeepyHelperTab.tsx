import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { useState } from 'react'
import DeepyHelperIcon from 'assets/icons/deeppavlov_logo_round.svg'
import { TOOLTIP_DELAY } from 'constants/constants'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import { BaseToolTip } from 'components/Menus'
import { CopilotSidePanel } from 'components/Panels'
import { TRIGGER_LEFT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import { Hint } from 'components/UI'
import s from './DeepyHelperTab.module.scss'

export const HELPER_TAB_ID = 'helperTab'

export const DeepyHelperTab = () => {
  const { UIOptions } = useUIOptions()
  const copilotIsActive = UIOptions[consts.COPILOT_SP_IS_ACTIVE]
  const [hintIsVisited, setHintIsVisited] = useState<boolean>(
    JSON.parse(`${localStorage.getItem(`${HELPER_TAB_ID}_IS_VISITED`)}`) ===
      true
  )
  // console.log('copilotIsActive = ', copilotIsActive)
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
          text='Ask Deepy if you need help with building your assistant'
          handleClose={() => setHintIsVisited(true)}
        />
      )}
    </button>
  )
}
