import { Link } from 'react-router-dom'
import s from './Card.module.scss'
import Bots from '../../assets/images/bots.svg'
import Skills from '../../assets/images/skills.svg'
import Robot from '../../assets/images/Robot.svg'
import Heart from '../../assets/images/heart.svg'

export const Card = ({ img, link, title, button }: any) => {
  return (
    <div className={s.card}>
      <img src={img == 'Robot' ? Robot : img == 'Heart' ? Heart : null} />
      <Link to={link}>
        <button
          style={{ backgroundColor: `${button}` }}
          className={`${button}`}>
          {title}
        </button>
      </Link>
    </div>
  )
}
