import DeepyHelperIcon from '@assets/icons/deepy_helper.png'
import classNames from 'classnames/bind'
import { TOOLTIP_DELAY } from '../../../constants/constants'
import { useDisplay } from '../../../context/DisplayContext'
import { consts } from '../../../utils/consts'
import { trigger } from '../../../utils/events'
import { TRIGGER_LEFT_SP_EVENT } from '../../BaseSidePanel/BaseSidePanel'
import BaseToolTip from '../../BaseToolTip/BaseToolTip'
import { CopilotSidePanel } from '../../CopilotSidePanel/CopilotSidePanel'
import s from './DeepyHelperTab.module.scss'

export const HELPER_TAB_ID = 'helperTab'

export const DeepyHelperTab = () => {
  const { options } = useDisplay()
  const copilotIsActive = options.get(consts.COPILOT_SP_IS_ACTIVE)
  let cx = classNames.bind(s)

  const handleBtnClick = () =>
    trigger(TRIGGER_LEFT_SP_EVENT, {
      children: <CopilotSidePanel />,
      isOpen: !copilotIsActive,
    })

  return (
    <button
      id={HELPER_TAB_ID}
      data-tooltip-id='helperTab'
      className={cx('icon', copilotIsActive && 'active')}
      onClick={handleBtnClick}
    >
      <img src={DeepyHelperIcon} alt='Deepy' />
      <BaseToolTip
        delayShow={TOOLTIP_DELAY}
        id='helperTab'
        content='Deepy'
        place='right'
      />
    </button>
  )
}
