import { ReactComponent as Error } from '@assets/icons/errorIcon.svg';
import { ReactComponent as Warning } from '@assets/icons/warningIcon.svg';
import { Tooltip } from 'react-tooltip';
import { ICollectionError, IСounter } from 'types/types';
import s from './StatusToolTip.module.scss';


const StatusToolTipAssistant = ({
  data,
  id,
}: {
  data?: ICollectionError[]
  id?: number
}) => {
  if (data === undefined || data.length === 0) {
    return null
  }

  const count: IСounter = data.reduce(
    (acc: IСounter, el: ICollectionError) => {
      const countError = el.error.length
      const countWarning = el.warning.length
      acc.countError += countError
      acc.countWarning += countWarning
      return acc
    },
    { countError: 0, countWarning: 0 }
  )

  const render = (key: string) => {
    if (count[key] === 0) {
      return null
    }

    const massage =
      key === 'countError'
        ? `критических ошибок ${count?.countError}`
        : `рекомендаций ${count?.countWarning}`

    const icon =
      key === 'countError' ? (
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
        <div className={s.massageCountError}>{count[key]}</div>
        <Tooltip
          id={`tooltip_error${id}${key}`}
          style={{ zIndex: 1, opacity: 1 }}
        >
          <div>
            <p>{massage}</p>
          </div>
        </Tooltip>
      </div>
    )
  }

  return (
    <>
      <div className={s.statusBox}>
        {render('countError')}
        {render('countWarning')}
      </div>
    </>
  )
}

export default StatusToolTipAssistant