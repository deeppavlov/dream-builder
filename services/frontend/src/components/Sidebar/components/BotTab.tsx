import { ReactComponent as CPU } from '../../../assets/icons/cpu.svg'
import { setVisited } from '../../../utils/setVisited'
import Hint from '../../Hint/Hint'
import s from './BotTab.module.scss'

export const BotTab = () => {
  const clickHandler = () => {
    setVisited()
  }
  return (
    <>
      <button
        onClick={clickHandler}
        data-tip='Bot'
        data-for='sidebar_tooltip'
        className={s.cpu}>
        <CPU className='activeTab' />
      </button>
    </>
  )
}
