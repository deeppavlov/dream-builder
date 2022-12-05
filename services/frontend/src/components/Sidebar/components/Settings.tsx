import s from './Settings.module.scss'
import { ReactComponent as Gear } from '../../../assets/icons/gear.svg'
export const Settings = () => {
  return (
    <button className={s.settings}>
      <Gear />
    </button>
  )
}
