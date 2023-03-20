import { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import DeepyHelperIcon from '@assets/icons/deepy_helper.png'
import { subscribe, trigger, unsubscribe } from '../../../utils/events'
import BaseToolTip from '../../BaseToolTip/BaseToolTip'
import { HELPER_SIDEPANEL_TRIGGER } from '../../HelperDialogSidePanel/HelperDialogSidePanel'
import s from './DeepyHelperTab.module.scss'


export const DeepyHelperTab = () => {
  const [isActive, setIsActive] = useState(false)
  let cx = classNames.bind(s)

  const handleBtnClick = () => trigger('HelperDialogSidePanel', {})

  const handleSidePanelTrigger = (data: { detail: { isOpen: boolean } }) =>
    setIsActive(data.detail?.isOpen)

  useEffect(() => {
    subscribe(HELPER_SIDEPANEL_TRIGGER, handleSidePanelTrigger)
    return () => unsubscribe(HELPER_SIDEPANEL_TRIGGER, handleSidePanelTrigger)
  }, [])

  return (
    <button
      data-tip
      data-tooltip-id='helperTab'
      className={cx('icon', isActive && 'active')}
      onClick={handleBtnClick}>
      <img src={DeepyHelperIcon} alt='Deepy' />
      <BaseToolTip id='helperTab' content='Deepy' place='right' />
    </button>
  )
}
