import classNames from 'classnames/bind'
import { useUIOptions } from '../../context/UIOptionsContext'
import { consts } from '../../utils/consts'
import SvgIcon from '../SvgIcon/SvgIcon'
import s from './SwitchViewButton.module.scss'

export const SwitchViewButton = () => {
  const cx = classNames.bind(s)

  const { UIOptions, setUIOption } = useUIOptions()

  const isTableView = UIOptions[consts.IS_TABLE_VIEW]

  const cardViewHandler = () => {
    setUIOption({
      name: consts.IS_TABLE_VIEW,
      value: true,
    })
  }
  const listViewHandler = () => {
    setUIOption({
      name: consts.IS_TABLE_VIEW,
      value: false,
    })
  }
  return (
    <div className={s.container}>
      <button
        onClick={listViewHandler}
        className={cx('switch', 'left', !isTableView && 'active')}
      >
        <SvgIcon iconName='cards' />
      </button>
      <button
        onClick={cardViewHandler}
        className={cx('switch', 'right', isTableView && 'active')}
      >
        <SvgIcon iconName='list' />
      </button>
    </div>
  )
}
