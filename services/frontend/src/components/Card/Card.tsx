import { Link } from 'react-router-dom'
import Robot from '../../assets/images/Robot.svg'
import Heart from '../../assets/images/heart.svg'
import GoToVA from '../../assets/images/go_to_va.png'
import GoToS from '../../assets/images/go_to_s.png'
import s from './Card.module.scss'

export const Card = ({ img, link, btnTitle, button, text, title }: any) => {
  return (
    <div className={s.card}>
      <div className={s.top}>
        <h5>{title}</h5>
        <p>{text}</p>
      </div>
      <img src={img == 'GoToVA' ? GoToVA : img == 'GoToS' ? GoToS : null} />
      <Link to={link}>
        <button
          style={{ backgroundColor: `${button}` }}
          className={`${button}`}>
          {btnTitle}
        </button>
      </Link>
    </div>
  )
}
