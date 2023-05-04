import { useNavigate } from 'react-router-dom'
import { ReactComponent as Gear } from '../../../assets/icons/gear.svg'
import { trigger } from '../../../utils/events'
import s from './SettingsTab.module.scss'

export const SettingsTab = () => {
  const navigate = useNavigate()
  const settingsClickHandler = () => {
    navigate('/profile')
  }
  return (
    <button
      data-tip='Settings'
      data-for='sidebar_tooltip'
      onClick={settingsClickHandler}
      className={s.settings}
    >
      <Gear />
    </button>
  )
}
