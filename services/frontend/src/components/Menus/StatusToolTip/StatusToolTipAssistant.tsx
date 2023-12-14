import { ReactComponent as Error } from '@assets/icons/error_circle.svg'
import { ReactComponent as Warning } from '@assets/icons/warning_triangle.svg'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'react-tooltip'
import { ICollectionError, IСounter } from 'types/types'
import s from './StatusToolTip.module.scss'

const StatusToolTipAssistant = ({
  data,
  id,
}: {
  data?: ICollectionError[]
  id?: number
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'toolTip_message',
  })
  if (data === undefined || data.length === 0) {
    return null
  }

  const count: IСounter = data.reduce(
    (acc: IСounter, el: ICollectionError) => {
      const error = el.error.length
      const warning = el.warning.length
      acc.error += error
      acc.warning += warning
      return acc
    },
    { error: 0, warning: 0 }
  )

  const render = (key: string) => {
    if (count[key] === 0) {
      return null
    }

    const message =
      key === 'error'
        ? `${t('error')} ${count[key]}`
        : `${t('warning')} ${count[key]}`

    const icon =
      key === 'error' ? (
        <Error
          style={{ width: 16, height: 17 }}
          data-tooltip-id={`tooltip_error${id}${key}`}
          data-tooltip-variant={'error'}
          data-tooltip-place='bottom'
        />
      ) : (
        <Warning
          style={{ width: 16, height: 17 }}
          data-tooltip-id={`tooltip_error${id}${key}`}
          data-tooltip-variant={'warning'}
          data-tooltip-place='bottom'
        />
      )

    return (
      <div className={s.errorBox}>
        {icon}
        <div className={s.messageCountError}>{count[key]}</div>
        <Tooltip
          id={`tooltip_error${id}${key}`}
          style={{ zIndex: 1, opacity: 1 }}
        >
          <div>
            <p>{message}</p>
          </div>
        </Tooltip>
      </div>
    )
  }

  return (
    <>
      <div className={s.statusBox}>
        {render('error')}
        {render('warning')}
      </div>
    </>
  )
}

export default StatusToolTipAssistant
