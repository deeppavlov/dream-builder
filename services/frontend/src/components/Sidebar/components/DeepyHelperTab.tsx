import DeepyHelperIcon from '@assets/icons/deepy_helper.png'
import BaseToolTip from '../../BaseToolTip/BaseToolTip'
import s from './DeepyHelperTab.module.scss'

export const DeepyHelperTab = () => {
  return (
    <button data-tip data-tooltip-id='helperTab' className={s.icon}>
      <img src={DeepyHelperIcon} alt='Deepy' />
      <BaseToolTip id='helperTab' content='Deepy' place='right' />
    </button>
  )
}
