import { ReactComponent as Puzzle } from '../../../assets/icons/puzzle.svg'
import BaseToolTip from '../../BaseToolTip/BaseToolTip'
import s from './SkillsTab.module.scss'

export const SkillsTab = () => {
  return (
    <button data-tooltip-id='sidebarSkillTab' className={s.puzzle}>
      <Puzzle />
    </button>
  )
}
