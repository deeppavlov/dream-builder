import React, { ReactNode, cloneElement } from 'react'
import { CheckBox } from '../Checkbox/Checkbox'
import { ReactComponent as Arrow } from '../../assets/icons/triangle_down.svg'
import s from './Table.module.scss'

interface TableProps {
  children: ReactNode
  checkbox?: boolean
  addButton?: JSX.Element
  first?: string
  second?: string
  third?: string
  fourth?: string
  fifth?: string
  sixth?: string
}

export const Table = ({
  children,
  first,
  second,
  third,
  fourth,
  fifth,
  sixth,
  addButton,
  checkbox,
}: TableProps) => {
  return (
    <>
      <div className={s.scroll}>
        <table className={s.table}>
          <thead className={s.thead}>
            <tr>
              {checkbox && (
                <th className={s.checkboxArea}>
                  <CheckBox />
                  <button>
                    <Arrow />
                  </button>
                </th>
              )}
              <th className={s.th}>{first ? first : 'Name'}</th>
              <th className={s.th}>{second ? second : 'Author'}</th>
              <th className={s.th}>{third ? third : 'Description'}</th>
              <th className={s.th}>{fourth ? fourth : 'Version'}</th>
              <th className={s.th}>{fifth ? fifth : 'Created'}</th>
              <th className={s.th}>{sixth ? sixth : 'Action'}</th>
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
