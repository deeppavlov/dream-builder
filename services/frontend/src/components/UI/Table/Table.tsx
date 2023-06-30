import React, { FC, ReactNode, cloneElement } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as Arrow } from 'assets/icons/triangle_down.svg'
import { Checkbox } from 'components/Buttons'
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
  const { t } = useTranslation('translation', { keyPrefix: 'assistant_table' })

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
            <th className={s.th}>{first ?? t('name')}</th>
            <th className={s.th}>{second ?? t('author')}</th>
            <th className={s.th}>{third ?? t('desc')}</th>
            {assistants && (
              <th className={s.th}>{fourth ?? t('visibility')}</th>
            )}

            {!withoutDate && <th className={s.th}>{fifth ?? t('created')}</th>}
            <th className={s.th}>{sixth ?? t('actions')}</th>
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
