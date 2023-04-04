import { ReactComponent as Gear } from '../../../assets/icons/gear.svg'
import { trigger } from '../../../utils/events'
import s from './SettingsTab.module.scss'

export const SettingsTab = () => {
  return (
    <button
      data-tip='Settings'
      data-for='sidebar_tooltip'
      onClick={() => trigger('BASE_SP_LEFT', {})}
      className={s.settings}>
      <Gear />
    </button>
  )
}
