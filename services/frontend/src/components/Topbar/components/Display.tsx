import { TOOLTIP_DELAY } from '../../../constants/constants'
import { useDisplay } from '../../../context/DisplayContext'
import { consts } from '../../../utils/consts'
import BaseToolTip from '../../BaseToolTip/BaseToolTip'
import SvgIcon from '../../SvgIcon/SvgIcon'
import s from './Display.module.scss'

export const Display = () => {
  const { options, dispatch } = useDisplay()
  const isTableView = options.get(consts.IS_TABLE_VIEW)

  const changeView = () =>
    dispatch({
      type: 'set',
      option: {
        id: consts.IS_TABLE_VIEW,
        value: !isTableView,
      },
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
