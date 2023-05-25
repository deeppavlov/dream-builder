import React,{ cloneElement,FC,ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
              <th className={s.th}>{first ? first : t('table.name')}</th>
              <th className={s.th}>{second ? second : t('table.author')}</th>
              <th className={s.th}>{third ? third : t('table.description')}</th>
              {assistants && (
                <th className={s.th}>
                  {fourth ? fourth : t('table.visibility')}
                </th>
              )}
              {!withoutDate && (
                <th className={s.th}>{fifth ? fifth : t('table.date')}</th>
              )}
              <th className={s.th}>{sixth ? sixth : t('table.actions')}</th>
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
    </>
  )
}
