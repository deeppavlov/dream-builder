import s from './DateCard.module.scss'

interface DateCardProps {
  date: string | Date
}

const DateCard = ({ date }: DateCardProps) => {
  const dateFormated = new Date(date)
  const [month, day, year] = [
    dateFormated.toLocaleString('en-US', { month: 'short' }),
    dateFormated.getDate(),
    dateFormated.getFullYear(),
  ]
  return (
    <div className={s.dateCard}>
      <span>{month}</span>
      <span className={s.dateCard__day}>{day}</span>
      <span>{year}</span>
    </div>
  )
}

export default DateCard
