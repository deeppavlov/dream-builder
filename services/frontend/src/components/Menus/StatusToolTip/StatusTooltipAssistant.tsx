import { ReactComponent as Error } from '@assets/icons/error_circle.svg'
import { ReactComponent as Warning } from '@assets/icons/warning_triangle.svg'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'react-tooltip'
import { ICollectionError, ICounter } from 'types/types'
import s from './StatusTooltip.module.scss'

const StatusTooltipAssistant = ({
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

  const count: ICounter = data.reduce(
    (acc: ICounter, el: ICollectionError) => {
      const errors = el.errors.length
      const warnings = el.warnings.length
      acc.errors += errors
      acc.warnings += warnings
      return acc
    },
    { errors: 0, warnings: 0 }
  )

  const render = (key: string) => {
    if (count[key] === 0) {
      return null
    }

    const message =
      key === 'errors'
        ? `${t('error')} ${count[key]}`
        : `${t('warning')} ${count[key]}`

    const icon =
      key === 'errors' ? (
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
        {render('errors')}
        {render('warnings')}
      </div>
    </>
  )
}

export default StatusTooltipAssistant
