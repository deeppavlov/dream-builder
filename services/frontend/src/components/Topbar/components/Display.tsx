import { TOOLTIP_DELAY } from '../../../constants/constants'
import { useUIOptions } from '../../../context/UIOptionsContext'
import { consts } from '../../../utils/consts'
import BaseToolTip from '../../BaseToolTip/BaseToolTip'
import SvgIcon from '../../SvgIcon/SvgIcon'
import s from './Display.module.scss'

export const Display = () => {
  const { UIOptions, setUIOption } = useUIOptions()
  const isTableView = UIOptions[consts.IS_TABLE_VIEW]

  const changeView = () =>
    setUIOption({
      name: consts.IS_TABLE_VIEW,
      value: !isTableView,
    })

  return (
    <button
      data-tooltip-id='viewType'
      onClick={changeView}
      className={s.display}
    >
      <SvgIcon iconName={isTableView ? 'list' : 'cards'} />
      <BaseToolTip
        delayShow={TOOLTIP_DELAY}
        id='viewType'
        content='Change View Type'
      />
    </button>
  )
}
