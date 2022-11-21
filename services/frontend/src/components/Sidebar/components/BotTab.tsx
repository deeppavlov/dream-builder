import { ReactComponent as CPU } from '../../../assets/icons/cpu.svg'
import s from './BotTab.module.scss'

export const BotTab = () => {
  return (
    <button className={s.cpu}>
      <CPU />
    </button>
  )
}
