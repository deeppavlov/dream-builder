import { ReactComponent as Puzzle } from '../../../assets/icons/puzzle.svg'
import s from './SkillsTab.module.scss'

export const SkillsTab = () => {
  return (
    <button data-tip='Skills' data-for='sidebar_tooltip' className={s.puzzle}>
      <Puzzle />
    </button>
  )
}
