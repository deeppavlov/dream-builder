import s from './AddBotCard.module.scss'
import Add from '../../assets/images/+.svg'

export const AddBotCard = () => {
  return (
    <div className={s.add}>
      <img src={Add} />
    </div>
  )
}
