import { ReactComponent as Gear } from '../../../assets/icons/gear.svg'
import s from './SettingsTab.module.scss'

export const SettingsTab = () => {
  return (
    <button className={s.settings}>
      <Gear />
    </button>
  )
}
