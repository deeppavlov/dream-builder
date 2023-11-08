import { Tooltip } from 'react-tooltip';
import { ICollectionError, IMassage } from 'types/types';
import style from './StatusToolTip.module.scss';


const StatusToolTipCard = ({
  data,
  id,
}: {
  data: ICollectionError
  id?: number
}) => {
  const errorRender = () => {
    if (data.error.length === 0) {
      return null
    }

    const massageError = data.error.map((el: IMassage, i: number) => {
      return (
        <li key={i}>
          {i + 1}. {el.massage}
        </li>
      )
    })

    return (
      <>
        <div
          data-tooltip-id={`tooltip_error${id}`}
          data-tooltip-variant={'error'}
          data-tooltip-place='right'
          className={`${style.status} ${style.error}`}
        ></div>
        <Tooltip id={`tooltip_error${id}`} style={{ zIndex: 1, opacity: 1}}>
          <div>
            <h3>Критические ошибки</h3>
            <ul>{massageError}</ul>
          </div>
        </Tooltip>
      </>
    )
  }

  const warningRender = () => {
    if (data.warning.length === 0) {
      return null
    }

    const massageWarning = data.warning.map((el: IMassage, i: number) => {
      return (
        <li key={i}>
          {i + 1}. {el.massage}
        </li>
      )
    })

    return (
      <>
        <div
          data-tooltip-id={`tooltip_warning${id}`}
          data-tooltip-variant={'warning'}
          data-tooltip-place='right'
          className={`${style.status} ${style.warning}`}
        ></div>
        <Tooltip id={`tooltip_warning${id}`} style={{ zIndex: 1, opacity: 1}}
        >
          <div>
            <h3>Рекомендации</h3>
            <ul>{massageWarning}</ul>
          </div>
        </Tooltip>
      </>
    )
  }

  return (
    <div className={style.statusBox}>
      {errorRender()}
      {warningRender()}
    </div>
  )
}

export default StatusToolTipCard