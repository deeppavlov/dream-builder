import classNames from 'classnames/bind'
import { ReactComponent as Puzzle } from '../../../assets/icons/puzzle.svg'
import s from './SkillsTab.module.scss'

interface Props {
  isActive: boolean
}

export const SkillsTab = ({ isActive }: Props) => {
  let cx = classNames.bind(s)

  return (
    <button
      data-tooltip-id='sidebarSkillTab'
      className={cx('puzzle', isActive && 'active')}
    >
      <Puzzle />
    </button>
  )
}
