import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import { TOOLTIP_DELAY } from 'constants/constants'
import { SvgIcon } from 'components/Helpers'
import { BaseToolTip } from 'components/Menus'
import s from './AdminPanelBtn.module.scss'

export const AdminPanelBtn = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'topbar.tooltips' })
  const navigate = useNavigate()

  return (
    <button
      data-tooltip-id='adminBtn'
      onClick={() => navigate(generatePath(RoutesList.admin.requests))}
      className={s.display}
    >
      <SvgIcon iconName='admin' />
      <BaseToolTip
        delayShow={TOOLTIP_DELAY}
        id='adminBtn'
        content={t('admin_page')}
      />
    </button>
  )
}
