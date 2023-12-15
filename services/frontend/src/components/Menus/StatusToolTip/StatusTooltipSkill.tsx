import { ReactComponent as Error } from '@assets/icons/error_circle.svg'
import { ReactComponent as Warning } from '@assets/icons/warning_triangle.svg'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'react-tooltip'
import { ICollectionError } from 'types/types'
import style from './StatusTooltip.module.scss'

const StatusTooltipSkill = ({
  data,
  id,
}: {
  data: ICollectionError
  id?: number
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'toolTip_message',
  })
  const render = (key: 'errors' | 'warnings') => {
    if (data[key].length === 0) {
      return null
    }

    const message = data[key].map((el: string, i: number) => {
      return (
        <li key={i}>
          {i + 1}. {el}
        </li>
      )
    })

    const icon =
      key === 'errors' ? (
        <Error
          data-tooltip-id={`tooltip_error${id}${key}`}
          data-tooltip-variant={'error'}
          data-tooltip-place='right'
        ></Error>
      ) : (
        <Warning
          data-tooltip-id={`tooltip_error${id}${key}`}
          data-tooltip-variant={'warning'}
          data-tooltip-place='right'
        ></Warning>
      )

    return (
      <div className={style.errorBox}>
        {icon}
        <div className={style.messageCountError}>{data[key].length}</div>
        <Tooltip
          id={`tooltip_error${id}${key}`}
          style={{ zIndex: 1, opacity: 1, width: 'auto', height: 'auto' }}
        >
          <div>
            <h3>{key === 'errors' ? t('error') : t('warning')}</h3>
            <ul>{message}</ul>
          </div>
        </Tooltip>
      </div>
    )
  }

  return (
    <div className={style.statusBox}>
      {render('errors')}
      {render('warnings')}
    </div>
  )
}

export default StatusTooltipSkill
