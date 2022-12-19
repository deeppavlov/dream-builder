import { ReactComponent as CPU } from '../../../assets/icons/cpu.svg'
import s from './BotTab.module.scss'

export const BotTab = () => {
  return (
    <button data-tip='Bot' data-for='sidebar_tooltip' className={s.cpu}>
      <CPU className='activeTab' />
    </button>
  )
}
