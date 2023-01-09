import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import s from './Card.module.scss'

interface CardProps {
  img: 'Skills' | 'VA'
  link: string
  btnTitle: string
  buttonColor?: 'purple'
  text: string
  title: string
}

export const Card = ({
  img,
  link,
  btnTitle,
  buttonColor,
  text,
  title,
}: CardProps) => {
  let cx = classNames.bind(s)
  return (
    <div className={s.card}>
      <h5 className={s.title}>{title}</h5>
      <div className={s.info}>
        <p className={s.infoText}>{text}</p>
        <div className={s.img_container}>
          <img src={`./src/assets/images/${img}.svg`} />
        </div>
      </div>
      <Link to={link}>
        <button className={cx('cardButton', buttonColor)}>{btnTitle}</button>
      </Link>
    </div>
  )
}
