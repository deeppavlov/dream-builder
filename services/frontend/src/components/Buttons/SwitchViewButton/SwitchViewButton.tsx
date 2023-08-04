import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { useGaSkills } from 'hooks/googleAnalytics/useGaSkills'
import { consts } from 'utils/consts'
import { SvgIcon } from 'components/Helpers'
import s from './SwitchViewButton.module.scss'

export const SwitchViewButton = () => {
  const { UIOptions, setUIOption } = useUIOptions()
  const isTableView = UIOptions[consts.IS_TABLE_VIEW]
  const cx = classNames.bind(s)
  const { skillsetViewChanged } = useGaSkills()

  const cardViewHandler = () => {
    skillsetViewChanged('list')
    setUIOption({
      name: consts.IS_TABLE_VIEW,
      value: true,
    })
  }
  const listViewHandler = () => {
    skillsetViewChanged('card')
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
