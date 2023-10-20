import { useUIOptions } from 'context'
import { useTranslation } from 'react-i18next'
import { TOOLTIP_DELAY } from 'constants/constants'
import { useGaAssistant } from 'hooks/googleAnalytics/useGaAssistant'
import { consts } from 'utils/consts'
import { SvgIcon } from 'components/Helpers'
import { BaseToolTip } from 'components/Menus'
import s from './Display.module.scss'

export const Display = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'topbar.tooltips' })
  const { UIOptions, setUIOption } = useUIOptions()
  const { vaViewChanged } = useGaAssistant()
  const isTableView = UIOptions[consts.IS_TABLE_VIEW]

  const changeView = () => {
    setUIOption({
      name: consts.IS_TABLE_VIEW,
      value: !isTableView,
    })
    vaViewChanged()
  }

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
        content={t('table_view')}
      />
    </button>
  )
}
