import { Link } from 'react-router-dom'
import GoToVA from '../../assets/images/go_to_va.png'
import GoToS from '../../assets/images/go_to_s.png'
import s from './Card.module.scss'

export const Card = ({ img, link, btnTitle, button, text, title }: any) => {
  return (
    <div className={s.card}>
      <h5>{title}</h5>
      <div className={s.top}>
        <div className={s.info}>
          <p>{text}</p>
        <div className={s.img_container}>
          <img src={img == 'GoToVA' ? GoToVA : img == 'GoToS' ? GoToS : null} />
        </div>
        </div>
      </div>
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
