import s from './Table.module.scss'

export const Table = ({ children, ...props }: any) => {
  return (
    <table className={s.table}>
      <thead className={s.thead}>
        <tr>
          <th className={s.th}>Name</th>
          <th className={s.th}>Author</th>
          <th className={s.th}>Description</th>
          <th className={s.th}>Version</th>
          <th className={s.th}>Created</th>
          <th className={s.th}></th>
        </tr>
      </thead>
      <tbody className={s.tbody}>{children}</tbody>
    </table>
  )
}
