import { Link } from 'react-router-dom'
import VA from '../../assets/images/VA.svg'
import S from '../../assets/images/Skills.svg'
import s from './Card.module.scss'

export const Card = ({ img, link, btnTitle, button, text, title }: any) => {
  return (
    <div className={s.card}>
      <h5>{title}</h5>
      <div className={s.top}>
        <div className={s.info}>
          <p>{text}</p>
          <div className={s.img_container}>
            <img src={img == 'GoToVA' ? VA : img == 'GoToS' ? S : null} />
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
