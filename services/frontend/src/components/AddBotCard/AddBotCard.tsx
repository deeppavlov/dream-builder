import Add from '../../assets/icons/+.svg'
import s from './AddBotCard.module.scss'

export const AddBotCard = ({ addCard }: any) => {
  const handleClick = () => {
    console.log('clicked');
    addCard()
  }
  return (
    <button
      onClick={() => {
        handleClick()
      }}
      className={s.add}>
      <img src={Add} />
    </button>
  )
}
