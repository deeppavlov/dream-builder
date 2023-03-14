import { FC, useId } from 'react'
import Add from '../../assets/icons/+.svg'
import BaseToolTip from '../../components/BaseToolTip/BaseToolTip'
import s from './AddButton.module.scss'

interface Props {
  text?: string
  addBot: () => void
  listView?: boolean
  disabledMsg?: string
}

export const AddButton: FC<Props> = ({
  text,
  addBot,
  listView,
  disabledMsg,
}) => {
  const tooltipId = useId()

  const handleClick = () => addBot()

  return (
    <>
      {!listView ? (
        <div data-tip data-tooltip-id={tooltipId}>
          <button
            onClick={handleClick}
            className={s.forCard}
            disabled={disabledMsg !== undefined}>
            <img src={Add} />
          </button>
        </div>
      ) : (
        <tr className={s.tr}>
          <td colSpan={5} className={s.td}>
            <div data-tip data-tooltip-id={tooltipId}>
              <button
                className={s.forTable}
                onClick={handleClick}
                disabled={disabledMsg !== undefined}>
                <img src={Add} />
                <p>{text || 'Create From Scratch'}</p>
              </button>
            </div>
          </td>
        </tr>
      )}
      {disabledMsg && (
        <BaseToolTip
          id={tooltipId}
          content={disabledMsg}
          theme='small'
          place='top'
        />
      )}
    </>
  )
}
