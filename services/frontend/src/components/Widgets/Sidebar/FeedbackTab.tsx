import classNames from 'classnames/bind'
import { useAuth } from 'context'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as FeedbackIcon } from 'assets/icons/feedBack.svg'
import { RoutesList } from 'router/RoutesList'
import { TOOLTIP_DELAY } from 'constants/constants'
import { BaseToolTip } from 'components/Menus'
import s from './FeedbackTab.module.scss'

interface Props {
  isActive?: boolean
}

export const FeedbackTab = ({ isActive }: Props) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  let cx = classNames.bind(s)

  const { user } = useAuth()
  const isAdmin = user?.role.id === 3
  if (!isAdmin) return null

  const feedbackClickHandler = () => {
    navigate(RoutesList.admin.feedback)
  }
  return (
    <button
      onClick={feedbackClickHandler}
      data-tooltip-id='sidebarFeedbackTab'
      className={cx('feedback', isActive && 'active')}
    >
      <FeedbackIcon />
      <BaseToolTip
        delayShow={TOOLTIP_DELAY}
        id='sidebarFeedbackTab'
        content={t('sidebar.tooltips.feedback')}
        place='right'
      />
    </button>
  )
}
