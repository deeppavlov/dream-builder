import { Tooltip } from 'react-tooltip';
import { ICollectionError, IСounter } from 'types/types';
import style from './StatusToolTip.module.scss';


const StatusToolTipAsistent = ({
  data,
  id,
}: {
  data?: ICollectionError[]
  id?: number
}) => {
  const count = data?.reduce(
    (acc: IСounter, el: ICollectionError) => {
      const countError = el.error.length
      const countWarning = el.warning.length
      acc.countError += countError
      acc.countWarning += countWarning
      return acc
    },
    { countError: 0, countWarning: 0 }
  )

  const errorRender = () => {
    if (count && count.countError === 0 ) {
      return null
    }

    const massageError = `критических ошибок ${count?.countError}`
    return (
      <>
        <div
          data-tooltip-id={`tooltip_error${id}`}
          data-tooltip-variant={'error'}
          data-tooltip-place='bottom'
          className={`${style.status} ${style.error}`}
        ></div>
        <Tooltip id={`tooltip_error${id}`} style={{ zIndex: 1, opacity: 1 }}>
          <div>
            <p>{massageError}</p>
          </div>
        </Tooltip>
      </>
    )
  }

  const warningRender = () => {
    if (count && count.countWarning === 0) {
      return null
    }

    const massageWarning = `рекомендаций ${count?.countWarning}`
    return (
      <>
        <div
          data-tooltip-id={`tooltip_warning${id}`}
          data-tooltip-html={massageWarning}
          data-tooltip-variant={'warning'}
          data-tooltip-place='bottom'
          className={`${style.status} ${style.warning}`}
        ></div>
        <Tooltip
          id={`tooltip_warning${id}`}
          style={{ zIndex: 1, opacity: 1 }}
        />
      </>
    )
  }

  return (
    <>
      <div className={style.statusBox}>
        {errorRender()}
        {warningRender()}
      </div>
    </>
  )
}

export default StatusToolTipAsistent