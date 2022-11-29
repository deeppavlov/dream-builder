import { Checkbox } from '../Checkbox/Checkbox'
import { ReactComponent as Arrow } from '../../assets/icons/triangle_down.svg'
import s from './Table.module.scss'

export const Table = ({
  children,
  first,
  second,
  third,
  fourth,
  fifth,
  sixth,
  addButton,
  ...props
}: any) => {
  return (
    <>
      <div className={s.scroll}>
        <table style={{ ...props }} className={s.table}>
          <thead className={s.thead}>
            <tr>
              <th className={s.checkboxArea}>
                <Checkbox />
                <button>
                  <Arrow />
                </button>
              </th>
              <th className={s.th}>{first ? first : 'Name'}</th>
              <th className={s.th}>{second ? second : 'Author'}</th>
              <th className={s.th}>{third ? third : 'Description'}</th>
              <th className={s.th}>{fourth ? fourth : 'Version'}</th>
              <th className={s.th}>{fifth ? fifth : 'Date'}</th>
              <th className={s.th}>{sixth ? sixth : 'Action'}</th>
            </tr>
          </thead>
          {addButton}
          <tbody className={s.body}>{children}</tbody>
        </table>
      </div>
    </>
  )
}
