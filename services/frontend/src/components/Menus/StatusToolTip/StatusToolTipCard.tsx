import { ReactComponent as Error } from '@assets/icons/errorIcon.svg'
import { ReactComponent as Warning } from '@assets/icons/warningIcon.svg'
import { Tooltip } from 'react-tooltip'
import { ICollectionError, IMassage } from 'types/types'
import style from './StatusToolTip.module.scss'

const StatusToolTipCard = ({
  data,
  id,
}: {
  data: ICollectionError
  id?: number
}) => {
  const render = (key: string) => {
    if (data[key].length === 0) {
      return null
    }

    const massage = data[key].map((el: IMassage, i: number) => {
      return (
        <li key={i}>
          {i + 1}. {el.massage}
        </li>
      )
    })

    const icon =
      key === 'error' ? (
        <Error
          data-tooltip-id={`tooltip_error${id}${key}`}
          data-tooltip-variant={key}
          data-tooltip-place='right'
        ></Error>
      ) : (
        <Warning
          data-tooltip-id={`tooltip_error${id}${key}`}
          data-tooltip-variant={key}
          data-tooltip-place='right'
        ></Warning>
      )

    return (
      <div className={style.errorBox}>
        {icon}
        <div className={style.massageCountError}>{data[key].length}</div>
        <Tooltip
          id={`tooltip_error${id}${key}`}
          style={{ zIndex: 1, opacity: 1 }}
        >
          <div>
            <h3>{key === 'error' ? 'Критические ошибки' : 'Рекомендации'}</h3>
            <ul>{massage}</ul>
          </div>
        </Tooltip>
      </div>
    )
  }

  return (
    <div className={style.statusBox}>
      {render('error')}
      {render('warning')}
    </div>
  )
}

export default StatusToolTipCard