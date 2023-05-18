import s from './TableRowsLoader.module.scss'

interface IProps {
  rowsCount: number
  colCount?: number
}

const TableRowsLoader = ({ rowsCount, colCount = 1 }: IProps) => {
  const colSpan = colCount / 2
  let rows = new Array(rowsCount).fill(null)
  let columns = new Array(colSpan - 1).fill(null)

  return (
    <>
      {rows?.map((_, i) => (
        <tr key={i} className={s.tr}>
          {columns?.map((_, i) => (
            <td key={i} colSpan={colSpan} className={s.td}>
              <div className={s.skeleton}></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export default TableRowsLoader
