import classNames from 'classnames/bind'
import DeepyHelperIcon from '@assets/icons/deepy_helper.png'
import { trigger } from '../../../utils/events'
import BaseToolTip from '../../BaseToolTip/BaseToolTip'
import { COPILOT_SP_TRIGGER } from '../../CopilotSidePanel/CopilotSidePanel'
import { useDisplay } from '../../../context/DisplayContext'
import { consts } from '../../../utils/consts'
import s from './DeepyHelperTab.module.scss'

export const DeepyHelperTab = () => {
  const { options } = useDisplay()
  const copilotIsActive = options.get(consts.LEFT_SIDEPANEL_IS_ACTIVE)
  let cx = classNames.bind(s)

  const handleBtnClick = () => trigger(COPILOT_SP_TRIGGER, {})

  return (
    <button
      data-tip
      data-tooltip-id='helperTab'
      className={cx('icon', copilotIsActive && 'active')}
      onClick={handleBtnClick}>
      <img src={DeepyHelperIcon} alt='Deepy' />
      <BaseToolTip id='helperTab' content='Deepy' place='right' />
    </button>
  )
}
