import s from './ResourcesTable.module.scss'

interface ResourcesTableProps {
  values: { name: string; value: string }[]
}

const ResourcesTable = ({ values }: ResourcesTableProps) => {
  return (
    <ul className={s.resourcesTable}>
      {values.map(({ name, value }, i) => (
        <li key={i} className={s.resourcesTable__item}>
          <span>{name}:</span>
          <span className={s.resourcesTable__value}>{value}</span>
        </li>
      ))}
    </ul>
  )
}

export default ResourcesTable
