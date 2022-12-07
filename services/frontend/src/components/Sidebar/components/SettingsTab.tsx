import { ReactComponent as Gear } from '../../../assets/icons/gear.svg'
import s from './SettingsTab.module.scss'

export const SettingsTab = () => {
  return (
    <button
      data-tip='Settings'
      data-for='sidebar_tooltip'
      className={s.settings}>
      <Gear />
    </button>
  )
}
