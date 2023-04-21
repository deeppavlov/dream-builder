import { ReactComponent as CardsView } from '../../../assets/icons/display.svg'
import { ReactComponent as ListView } from '../../../assets/icons/list-view.svg'
import { TOOLTIP_DELAY } from '../../../constants/constants'
import { useDisplay } from '../../../context/DisplayContext'
import { consts } from '../../../utils/consts'
import BaseToolTip from '../../BaseToolTip/BaseToolTip'
import s from './Display.module.scss'

export const Display = ({ viewHandler }: any) => {
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
      {isTableView ? <ListView /> : <CardsView />}
      <BaseToolTip
        delayShow={TOOLTIP_DELAY}
        id='viewType'
        content='Change View Type'
      />
    </button>
  )
}
