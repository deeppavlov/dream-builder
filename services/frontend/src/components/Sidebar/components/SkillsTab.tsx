import { ReactComponent as Puzzle } from '../../../assets/icons/puzzle.svg'
import s from './SkillsTab.module.scss'

export const SkillsTab = () => {
  return (
    <button className={s.puzzle}>
      <Puzzle />
    </button>
  )
}
