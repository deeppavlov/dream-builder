import s from './Table.module.scss'

export const Table = ({
  children,
  first,
  second,
  third,
  fourth,
  fifth,
  sixth,
}: any) => {
  return (
    <table className={s.table}>
      <thead className={s.thead}>
        <tr>
          <th className={s.th}>{first ? first : 'Name'}</th>
          <th className={s.th}>{second ? second : 'Author'}</th>
          <th className={s.th}>{third ? third : 'Description'}</th>
          <th className={s.th}>{fourth ? fourth : 'Version'}</th>
          <th className={s.th}>{fifth ? fifth : 'Date'}</th>
          <th className={s.th}>{sixth ? sixth : 'Action'}</th>
        </tr>
      </thead>
      <tbody className={s.tbody}>{children}</tbody>
    </table>
  )
}
