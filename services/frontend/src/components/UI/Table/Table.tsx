import React, { FC, ReactNode, cloneElement } from 'react'
import { ReactComponent as Arrow } from 'assets/icons/triangle_down.svg'
import { Checkbox } from 'components/Buttons'
import s from './Table.module.scss'

interface TableProps {
  children: ReactNode
  checkbox?: boolean
  addButton?: JSX.Element // TODO: Rename to 'header' or smth
  headers: string[]
}

export const Table: FC<TableProps> = ({
  children,
  headers,
  addButton,
  checkbox,
}) => {
  return (
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
            {headers.map(
              header =>
                header && (
                  <th key={header} className={s.th}>
                    {header}
                  </th>
                )
            )}
          </tr>
        </thead>
        {addButton}
        <tbody className={s.body}>
          {React.Children.map(children, child =>
            cloneElement(<>{child}</>, { checkbox })
          )}
        </tbody>
      </table>
    </div>
  )
}
