import { useTranslation } from 'react-i18next'
import { ReactComponent as Renew } from 'assets/icons/renew.svg'
import { TOOLTIP_DELAY } from 'constants/constants'
import { Button } from 'components/Buttons'
import { BaseToolTip } from 'components/Menus'
import { ErrorCard } from 'components/UI'
import { ErrorPanel } from '../CopilotSidePanel'
import s from './DummyErrorPanel.module.scss'

interface IProps {
  errorPanel: ErrorPanel
  handleRenewClick: () => void
  handleErrorBtnClick: (type: 'auth' | 'api-key') => void
}

const DummyErrorPanel = ({
  errorPanel,
  handleErrorBtnClick,
  handleRenewClick,
}: IProps) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'sidepanels.deepy',
  })

  return (
    <div className={s.errorPanel}>
      <ErrorCard message={errorPanel.msg} type='error' />
      <div className={s.errorPanelBtns}>
        <Button
          theme='secondary'
          props={{
            onClick: handleRenewClick,
          }}
        >
          <BaseToolTip
            delayShow={TOOLTIP_DELAY}
            id='renew'
            content={t('tooltips.dialog_renew')}
          />
          <Renew data-tooltip-id='renew' />
        </Button>
        <Button
          theme='primary'
          props={{ onClick: () => handleErrorBtnClick(errorPanel.type) }}
        >
          {t(`error.button_${errorPanel.type}`)}
        </Button>
      </div>
    </div>
  )
}

export default DummyErrorPanel
