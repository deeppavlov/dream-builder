import classNames from 'classnames/bind'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import { TOOLTIP_DELAY } from 'constants/constants'
import { SvgIcon } from 'components/Helpers'
import { BaseToolTip } from 'components/Menus'
import s from './PublicationRequestsTab.module.scss'

interface Props {
  isActive?: boolean
}

export const PublicationRequestsTab = ({ isActive }: Props) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  let cx = classNames.bind(s)

  const clickHandler = () => {
    navigate(RoutesList.admin.requests)
  }
  return (
    <button
      onClick={clickHandler}
      data-tooltip-id='sidebarRequestsTab'
      className={cx('requests', isActive && 'active')}
    >
      <SvgIcon iconName={'copy_1'} />
      <BaseToolTip
        delayShow={TOOLTIP_DELAY}
        id='sidebarRequestsTab'
        content={t('sidebar.tooltips.requests')}
        place='right'
      />
    </button>
  )
}
