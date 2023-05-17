import React,{ cloneElement,FC,ReactNode } from 'react'
import { ReactComponent as Arrow } from '../../assets/icons/triangle_down.svg'
import { Checkbox } from '../Checkbox/Checkbox'
import s from './Table.module.scss'

interface TableProps {
  children: ReactNode
  checkbox?: boolean
  addButton?: JSX.Element // TODO: Rename to 'header' or smth
  first?: string
  second?: string
  third?: string
  fourth?: string
  fifth?: string
  sixth?: string
  withoutDate?: boolean
  assistants?: boolean
}

export const Table: FC<TableProps> = ({
  children,
  first,
  second,
  third,
  fourth,
  fifth,
  sixth,
  addButton,
  checkbox,
  withoutDate,
  assistants,
}) => {
  return (
    <>
      <div className={s.scroll}>
        <table className={s.table}>
          <thead className={s.thead}>
            <tr>
              {checkbox && (
                <th className={s.checkboxArea}>
                  <Checkbox />
                  <button>
                    <Arrow />
                  </button>
                </th>
              )}
              <th className={s.th}>{first ? first : 'Name'}</th>
              <th className={s.th}>{second ? second : 'Author'}</th>
              <th className={s.th}>{third ? third : 'Description'}</th>
              {assistants && (
                <th className={s.th}>{fourth ? fourth : 'Visibility'}</th>
              )}

              {!withoutDate && (
                <th className={s.th}>{fifth ? fifth : 'Created'}</th>
              )}
              <th className={s.th}>{sixth ? sixth : 'Actions'}</th>
            </tr>
          </thead>
          {addButton}
          <tbody className={s.body}>
            {React.Children.map(children, child =>
              cloneElement(child, { checkbox })
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
