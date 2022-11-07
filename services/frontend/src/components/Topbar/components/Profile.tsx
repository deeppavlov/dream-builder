import Avatar from '../../../assets/images/avatar.png'
import s from './Profile.module.scss'

export const Profile = () => {
  return (
    <button className={s.avatar}>
      <img src={Avatar} />
      <span className={s.arrow} />
    </button>
  )
}
